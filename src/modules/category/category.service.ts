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
import { FileUpload } from 'graphql-upload';
import { nanoid } from 'nanoid';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigType } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { Category } from './models/category.model';
import { Reference } from '../reference/models/reference.model';
import { CategoryAttachment } from '../category-attachment/models/category-attachment.model';

import { PrismaService } from '../../prisma.service';

import { createFileFromReadStream } from '../../utils';

import { CreateCategoryInput } from './dto/create-category-input.dto';
import { GetOneCategoryInput } from './dto/get-one-category-input.dto';
import { GetAllCategoriesInput } from './dto/get-all-categories-input.dto';
import { UpdateCategoryInput } from './dto/update-category-input.dto';
import { UploadCategoryImageInput } from './dto/upload-category-image-input.dto';
import { DeleteCategoryImageInput } from './dto/delete-category-image-input.dto';

@Injectable()
export class CategoryService {
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

  public async create(input: CreateCategoryInput): Promise<Category> {
    const { name } = input;

    const exisingCategoryByName = await this.prismaService.category.findFirst({
      where: { name },
    });

    if (exisingCategoryByName) {
      throw new ConflictException(
        `already exist an category with the name ${name}.`,
      );
    }

    const { parentUid } = input;

    let exisingCategoryByParentUid;

    if (parentUid) {
      exisingCategoryByParentUid = await this.prismaService.category.findUnique(
        {
          where: { uid: parentUid },
        },
      );

      if (!exisingCategoryByParentUid) {
        throw new ConflictException(
          `can't get category with the uid ${parentUid}.`,
        );
      }
    }

    const created = await this.prismaService.category.create({
      data: {
        name,
        slug: name.replace(/\s/g, '-').toLowerCase(),
        parentId: exisingCategoryByParentUid?.id,
      },
    });

    return {
      ...created,
      parent: exisingCategoryByParentUid,
    } as any;
  }

  public async getOne(getOneCategoryInput: GetOneCategoryInput) {
    const { uid } = getOneCategoryInput;

    const category = await this.prismaService.category.findUnique({
      where: { uid },
      include: {
        parent: {
          select: {
            id: true,
          },
        },
      },
    });

    return category as any;
  }

  public async getAll(input: GetAllCategoriesInput): Promise<Category[]> {
    const { limit, skip = 0, q, onlyRoots = false } = input;

    const categories = await this.prismaService.category.findMany({
      where: {
        name: {
          contains: q,
        },
        parentId: onlyRoots ? null : undefined,
      },
      take: limit,
      skip: skip,
      include: {
        parent: {
          select: {
            id: true,
          },
        },
      },
    });

    return categories as any;
  }

  public async update(
    getOneCategoryInput: GetOneCategoryInput,
    input: UpdateCategoryInput,
  ): Promise<Category> {
    const { uid } = getOneCategoryInput;

    const category = await this.getOne(getOneCategoryInput);

    if (!category) {
      throw new NotFoundException(`can't get category with the uid ${uid}.`);
    }

    const { name } = input;

    // check if the name is already taken
    if (name) {
      const exisingCategoryByName = await this.prismaService.category.findFirst(
        {
          where: { name },
        },
      );

      if (exisingCategoryByName && exisingCategoryByName.id !== category.id) {
        throw new ConflictException(
          `already exist an category with the name ${name}.`,
        );
      }
    }

    const { parentUid } = input;

    // try to get the parent category
    let exisingCategoryByParentUid;

    if (parentUid) {
      exisingCategoryByParentUid = await this.prismaService.category.findUnique(
        {
          where: { uid: parentUid },
        },
      );

      if (!exisingCategoryByParentUid) {
        throw new ConflictException(
          `can't get category with the uid ${parentUid}.`,
        );
      }
    }

    // update the category
    const updated = await this.prismaService.category.update({
      where: {
        id: category.id,
      },
      data: {
        name,
        slug: name?.replace(/\s/g, '-').toLowerCase(),
        parentId: exisingCategoryByParentUid?.id,
        updatedAt: new Date(),
      },
      include: {
        parent: true,
      },
    });

    return {
      ...category,
      ...updated,
    } as any;
  }

  public async delete(getOneCategoryInput: GetOneCategoryInput) {
    const { uid } = getOneCategoryInput;

    const category = await this.getOne(getOneCategoryInput);

    if (!category) {
      throw new NotFoundException(`can't get category with the uid ${uid}.`);
    }

    const { children, categoryAttachments } =
      await this.prismaService.category.findUnique({
        where: {
          uid,
        },
        include: {
          children: true,
          categoryAttachments: {
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

    if (children.length) {
      throw new ConflictException(`can't delete category with children.`);
    }

    // delete the category_attachment
    await this.prismaService.categoryAttachment.deleteMany({
      where: {
        categoryId: category.id,
      },
    });

    // delete the attachments
    await this.prismaService.attachment.deleteMany({
      where: {
        id: {
          in: categoryAttachments.map(({ attachment }) => attachment.id),
        },
      },
    });

    // delete the category
    await this.prismaService.category.delete({
      where: {
        id: category.id,
      },
    });

    return category as any;
  }

  /* CRUD LOGIC */

  /* RESOLVE FIELDS LOGIC */

  public async getByIds(masterIds: number[]): Promise<Category[]> {
    const categories = await this.prismaService.category.findMany({
      where: {
        id: {
          in: masterIds,
        },
      },
    });

    return categories as any;
  }

  public async children(parent: Category): Promise<Category[]> {
    const { id } = parent;

    const children = await this.prismaService.category.findMany({
      where: {
        parentId: {
          equals: id,
        },
      },
      include: {
        parent: {
          select: {
            id: true,
          },
        },
      },
    });

    return children as any;
  }

  public async categoryAttachments(
    parent: Category,
  ): Promise<CategoryAttachment[]> {
    const { id } = parent;

    const { categoryAttachments } =
      await this.prismaService.category.findUnique({
        where: { id },
        include: {
          categoryAttachments: {
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

    return categoryAttachments as any;
  }

  public async references(parent: Category): Promise<Reference[]> {
    const { id } = parent;

    const { references } = await this.prismaService.category.findUnique({
      where: { id },
      include: {
        references: true,
      },
    });

    return references as any;
  }

  /* RESOLVE FIELDS LOGIC */

  /* EXTRA LOGIC */

  public async uploadImage(
    uploadCategoryImageInput: UploadCategoryImageInput,
    fileUpload: FileUpload,
  ): Promise<Category> {
    let filePath = '';

    try {
      const { uid } = uploadCategoryImageInput;

      const category = await this.getOne({ uid });

      if (!category) {
        throw new NotFoundException(`can't get category with the uid ${uid}.`);
      }

      // try to get the category attachment by the reference id and the version

      const { main, version } = uploadCategoryImageInput;

      const categoryAttachment =
        await this.prismaService.categoryAttachment.findFirst({
          where: {
            categoryId: category.id,
            version,
          },
        });

      // if the category attachment is found, throw an error
      if (categoryAttachment) {
        throw new ConflictException(
          `already exist an category attachment with the version: ${version}.`,
        );
      }

      const { filename, mimetype } = fileUpload;

      if (!mimetype.startsWith('image')) {
        throw new BadRequestException('mimetype not allowed.');
      }

      const basePath = path.resolve(__dirname);

      const fileExt = filename.split('.').pop();

      const publicId = nanoid(6);

      filePath = `${basePath}/${category.slug}_${publicId}.${fileExt}`;

      const { createReadStream } = fileUpload;

      const stream = createReadStream();

      await createFileFromReadStream(stream, filePath);

      let cloudinaryResponse;

      try {
        const folderName =
          this.appConfiguration.environment === 'production'
            ? 'categories'
            : `${this.appConfiguration.environment}_categories`;

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
          type: 'category_image',
          url: cloudinaryResponse.secure_url,
        },
      });

      await this.prismaService.categoryAttachment.create({
        data: {
          categoryId: category.id,
          attachmentId: attachment.id,
          main,
          version,
        },
      });

      return category as any;
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  public async deleteImage(input: DeleteCategoryImageInput) {
    // get the category
    const { categoryUid } = input;
    const category = await this.getOne({
      uid: categoryUid,
    });

    if (!category) {
      throw new NotFoundException(
        `can't get category with the uid ${categoryUid}.`,
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
      Logger.error(error.message, CategoryService.name);
    }

    // delete the category_attachment
    await this.prismaService.categoryAttachment.delete({
      where: {
        categoryId_attachmentId: {
          categoryId: category.id,
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

    return category as any;
  }

  /* EXTRA LOGIC */
}
