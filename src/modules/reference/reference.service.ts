import * as fs from 'fs';
import * as path from 'path';

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import { nanoid } from 'nanoid';

import appConfig from '../../config/app.config';

import { Reference } from './models/reference.model';
import { Attachment } from '../attachment/models/attachment.model';

import { PrismaService } from '../../prisma.service';

import {
  capitalizePhrase,
  capitalizeFirstLetter,
  createFileFromReadStream,
} from '../../utils';

import { CreateReferenceInput } from './dto/create-reference-input.dto';
import { GetAllReferencesInput } from './dto/get-all-references-input.dto';
import { GetOneReferenceInput } from './dto/get-one-reference-input.dto';
import { UpdateReferenceInput } from './dto/update-reference-input.dto';
import { UploadReferenceImageInput } from './dto/upload-reference-image-input.dto';
import { DeleteReferenceImageInput } from './dto/delete-reference-image-input.dto';

@Injectable()
export class ReferenceService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly prismaService: PrismaService,
  ) {
    cloudinary.config({
      cloud_name: this.appConfiguration.cloudinary.cloudName,
      api_key: this.appConfiguration.cloudinary.apiKey,
      api_secret: this.appConfiguration.cloudinary.apiSecret,
    });
  }

  /* CRUD LOGIC */

  public async create(input: CreateReferenceInput): Promise<Reference> {
    const { sku } = input;

    const exisingReferenceBySKU = await this.prismaService.reference.findFirst({
      where: { sku },
    });

    if (exisingReferenceBySKU) {
      throw new ConflictException(
        `already exist a reference with the sku ${sku}.`,
      );
    }

    const { categoryUid } = input;

    const exisingCategory = await this.prismaService.category.findUnique({
      where: { uid: categoryUid },
    });

    if (!exisingCategory) {
      throw new ConflictException(
        `can't get category with the uid ${categoryUid}.`,
      );
    }

    const created = await this.prismaService.reference.create({
      data: {
        sku,
        name: capitalizePhrase(input.name),
        description: input.description
          ? capitalizeFirstLetter(input.description)
          : undefined,
        categoryId: exisingCategory.id,
      },
    });

    return {
      ...created,
      category: exisingCategory,
    } as any;
  }

  public async getOne(input: GetOneReferenceInput): Promise<Reference> {
    const { uid } = input;

    const reference = await this.prismaService.reference.findUnique({
      where: { uid },
      include: {
        category: {
          select: {
            id: true,
          },
        },
      },
    });

    return reference as any;
  }

  public async getAll(input: GetAllReferencesInput): Promise<Reference[]> {
    const { limit, skip = 0, q } = input;

    const references = await this.prismaService.reference.findMany({
      where: {
        name: {
          contains: q,
        },
      },
      take: limit,
      skip: skip,
      include: {
        category: {
          select: {
            id: true,
          },
        },
      },
    });

    return references as any;
  }

  public async update(
    getOneReferenceInput: GetOneReferenceInput,
    input: UpdateReferenceInput,
  ): Promise<Reference> {
    const { uid } = getOneReferenceInput;

    const reference = await this.getOne(getOneReferenceInput);

    if (!reference) {
      throw new NotFoundException(`can't get reference with the uid ${uid}.`);
    }

    const { sku } = input;

    // check if the sku is already taken
    if (sku) {
      const exisingReferenceByName =
        await this.prismaService.reference.findFirst({
          where: { sku },
        });

      if (
        exisingReferenceByName &&
        exisingReferenceByName.id !== reference.id
      ) {
        throw new ConflictException(
          `already exist an reference with the sku ${sku}.`,
        );
      }
    }

    const { categoryUid } = input;

    // try to get the category
    let exisingCategory;

    if (categoryUid) {
      exisingCategory = await this.prismaService.category.findUnique({
        where: { uid: categoryUid },
      });

      if (!exisingCategory) {
        throw new ConflictException(
          `can't get category with the uid ${categoryUid}.`,
        );
      }
    }

    // update the reference
    const { name, description } = input;

    const updated = await this.prismaService.reference.update({
      where: {
        id: reference.id,
      },
      data: {
        sku,
        name: name ? capitalizePhrase(name) : undefined,
        description: description
          ? capitalizeFirstLetter(description)
          : undefined,
        categoryId: exisingCategory ? exisingCategory.id : undefined,
        updatedAt: new Date(),
      },
      include: {
        category: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      ...reference,
      ...updated,
    } as any;
  }

  public async delete(input: GetOneReferenceInput) {
    const { uid } = input;

    const reference = await this.getOne(input);

    if (!reference) {
      throw new NotFoundException(`can't get reference with the uid ${uid}.`);
    }

    // TODO: delete the reference_attachment

    // TODO: delete the attachments

    // delete the reference
    await this.prismaService.reference.delete({
      where: {
        id: reference.id,
      },
    });

    return reference as any;
  }

  /* CRUD LOGIC */

  /* RESOLVE FIELDS LOGIC */

  public async getByIds(masterIds: number[]): Promise<Reference[]> {
    const references = await this.prismaService.reference.findMany({
      where: {
        id: {
          in: masterIds,
        },
      },
    });

    return references as any;
  }

  public async referenceAttachments(parent: Reference): Promise<Attachment[]> {
    const { id } = parent;

    const { referenceAttachments } =
      await this.prismaService.reference.findUnique({
        where: { id },
        include: {
          referenceAttachments: {
            include: {
              attachment: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

    return referenceAttachments as any;
  }

  /* RESOLVE FIELDS LOGIC */

  /* EXTRA LOGIC */

  public async uploadImage(
    uploadReferenceImageInput: UploadReferenceImageInput,
    fileUpload: FileUpload,
  ): Promise<Reference> {
    let filePath = '';

    try {
      const { uid } = uploadReferenceImageInput;

      const reference = await this.getOne({ uid });

      if (!reference) {
        throw new NotFoundException(`can't get reference with the uid ${uid}.`);
      }

      const { filename, mimetype } = fileUpload;

      if (!mimetype.startsWith('image')) {
        throw new BadRequestException('mimetype not allowed.');
      }

      const basePath = path.resolve(__dirname);

      const fileExt = filename.split('.').pop();

      const publicId = nanoid(6);

      filePath = `${basePath}/${reference.sku}_${publicId}.${fileExt}`;

      const { createReadStream } = fileUpload;

      const stream = createReadStream();

      await createFileFromReadStream(stream, filePath);

      let cloudinaryResponse;

      try {
        const folderName =
          this.appConfiguration.environment === 'production'
            ? 'references'
            : `${this.appConfiguration.environment}_references`;

        cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
          folder: folderName,
          public_id: publicId,
          quality: 'auto:best',
        });
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(error.message);
      }

      // create the attachment
      const attachment = await this.prismaService.attachment.create({
        data: {
          cloudId: cloudinaryResponse.public_id,
          type: 'reference_image',
          url: cloudinaryResponse.secure_url,
        },
      });

      // create the reference_attachment
      const { main, version } = uploadReferenceImageInput;

      await this.prismaService.referenceAttachment.create({
        data: {
          referenceId: reference.id,
          attachmentId: attachment.id,
          main,
          version,
        },
      });

      return reference as any;
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  public async deleteImage(
    input: DeleteReferenceImageInput,
  ): Promise<Reference> {
    // get the reference
    const { referenceUid } = input;

    const reference = await this.getOne({
      uid: referenceUid,
    });

    if (!reference) {
      throw new NotFoundException(
        `can't get reference with the uid ${referenceUid}.`,
      );
    }

    // get the attachment
    const { attachmentUid } = input;
    const attachment = await this.prismaService.attachment.findUnique({
      where: {
        uid: attachmentUid,
      },
    });

    if (!attachment) {
      throw new NotFoundException(
        `can't get attachment with the uid ${attachmentUid}.`,
      );
    }

    // delete the file in cloudinary
    try {
      await cloudinary.uploader.destroy(attachment.cloudId);
    } catch (error) {
      Logger.error(error.message, ReferenceService.name);
    }

    // delete the reference_attachment
    await this.prismaService.referenceAttachment.delete({
      where: {
        referenceId_attachmentId: {
          referenceId: reference.id,
          attachmentId: attachment.id,
        },
      },
    });

    // delete the attachment
    await this.prismaService.attachment.delete({
      where: {
        id: attachment.id,
      },
    });

    return reference as any;
  }

  /* EXTRA LOGIC */
}
