import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { Business } from './models/business.model';

import { PrismaService } from '../../prisma.service';

import { capitalizePhrase } from '../../utils';

import { CreateBusinessInput } from './dto/create-business-input.dto';
import { GetOneBusinessInput } from './dto/get-one-business-input.dto';
import { GetAllBusinessesInput } from './dto/get-all-businesses-input.dto';
import { UpdateBusinessInput } from './dto/update-business-input.dto';

@Injectable()
export class BusinessService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly prismaService: PrismaService,
  ) {}

  /* CRUD LOGIC */
  public async create(input: CreateBusinessInput): Promise<Business> {
    const { name } = input;

    const nameToUse = capitalizePhrase(name);

    const exisingBusinessByName = await this.prismaService.business.findUnique({
      where: { name: nameToUse },
    });

    if (exisingBusinessByName) {
      throw new ConflictException(
        `already exist a business with the name ${name}.`,
      );
    }

    const { authUid } = input;

    const exisingUser = await this.prismaService.user.findUnique({
      where: { authUid },
    });

    if (!exisingUser) {
      throw new ConflictException(
        `can't get user with the auth uid ${authUid}.`,
      );
    }

    const created = await this.prismaService.business.create({
      data: {
        name: nameToUse,
        address: input.address,
        phoneNumber: input.phoneNumber,
        userId: exisingUser.id,
      },
    });

    return {
      ...created,
      user: exisingUser,
    } as any;
  }

  public async getOne(input: GetOneBusinessInput): Promise<Business> {
    const { uid } = input;

    const business = await this.prismaService.business.findUnique({
      where: { uid },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return business as any;
  }

  public async getAll(input: GetAllBusinessesInput): Promise<Business[]> {
    const { limit, skip = 0, q } = input;

    const business = await this.prismaService.business.findMany({
      where: {
        name: {
          contains: q,
        },
      },
      take: limit,
      skip: skip,
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return business as any;
  }

  public async update(
    getOneReferenceInput: GetOneBusinessInput,
    input: UpdateBusinessInput,
  ): Promise<Business> {
    const { uid } = getOneReferenceInput;

    const business = await this.getOne(getOneReferenceInput);

    if (!business) {
      throw new NotFoundException(`can't get business with the uid ${uid}.`);
    }

    const { name } = input;

    // check if the sku is already taken
    if (name) {
      const exisingBusinessByName =
        await this.prismaService.business.findUnique({
          where: { name: capitalizePhrase(name) },
        });

      if (exisingBusinessByName && exisingBusinessByName.id !== business.id) {
        throw new ConflictException(
          `already exist a business with the name ${name}.`,
        );
      }
    }

    const { authUid } = input;

    // try to get the user
    let exisingUser;

    if (authUid) {
      exisingUser = await this.prismaService.user.findUnique({
        where: { authUid },
      });

      if (!exisingUser) {
        throw new NotFoundException(
          `can't get user with the auth uid ${authUid}.`,
        );
      }
    }

    // update

    const updated = await this.prismaService.business.update({
      where: {
        id: business.id,
      },
      data: {
        name: name ? capitalizePhrase(name) : business.name,
        phoneNumber: input.phoneNumber,
        address: input.address,
        userId: exisingUser ? exisingUser.id : undefined,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      ...business,
      ...updated,
    } as any;
  }

  public async delete(input: GetOneBusinessInput) {
    const { uid } = input;

    const business = await this.getOne(input);

    if (!business) {
      throw new NotFoundException(`can't get business with the uid ${uid}.`);
    }

    // delete the business
    await this.prismaService.business.delete({
      where: {
        id: business.id,
      },
    });

    return business as any;
  }

  /* CRUD LOGIC */
}
