import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { Product } from './models/product.model';

import { PrismaService } from '../../prisma.service';
import { ReferenceService } from '../reference/reference.service';

import { CreateProductInput } from './dto/create-product-input.dto';
import { GetOneProductInput } from './dto/get-one-product-input.dto';
import { GetAllProductsInput } from './dto/get-all-products-input.dto';
import { UpdateProductInput } from './dto/update-reference-input.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly prismaService: PrismaService,
    private readonly referenceService: ReferenceService,
  ) {}

  /* CRUD LOGIC */

  public async create(input: CreateProductInput): Promise<Product> {
    const { referenceUid } = input;

    // check if the reference exists
    const exisingReference = await this.prismaService.reference.findUnique({
      where: { uid: referenceUid },
    });

    if (!exisingReference) {
      throw new NotFoundException(
        `reference with uid ${referenceUid} not found`,
      );
    }

    // check if already exists a product for the reference
    const existingProductByReference =
      await this.prismaService.product.findFirst({
        where: { referenceId: exisingReference.id },
      });

    if (existingProductByReference) {
      throw new ConflictException(
        `product already exists for reference with uid ${referenceUid}`,
      );
    }

    // create the product
    const { costPrice, sellPrice, salePrice, stock } = input;

    const created = await this.prismaService.product.create({
      data: {
        costPrice,
        sellPrice,
        salePrice,
        stock,
        referenceId: exisingReference.id,
      },
    });

    return {
      ...created,
      reference: exisingReference,
    } as any;
  }

  public async getOne(input: GetOneProductInput): Promise<Product> {
    const { uid } = input;

    const product = await this.prismaService.product.findUnique({
      where: { uid },
      include: {
        reference: {
          select: {
            id: true,
          },
        },
      },
    });

    return product as any;
  }

  public async getAll(input: GetAllProductsInput): Promise<Product[]> {
    const { limit, skip = 0 } = input;

    const products = await this.prismaService.product.findMany({
      take: limit,
      skip: skip,
      include: {
        reference: {
          select: {
            id: true,
          },
        },
      },
    });

    return products as any;
  }

  public async update(
    getOneProductInput: GetOneProductInput,
    input: UpdateProductInput,
  ): Promise<Product> {
    // check if the product exists
    const { uid } = getOneProductInput;

    const product = await this.getOne(getOneProductInput);

    if (!product) {
      throw new NotFoundException(`can't get product with the uid ${uid}.`);
    }

    // check if it's possible to update the product based on the reference
    const { referenceUid } = input;

    if (referenceUid) {
      const reference = await this.referenceService.getOne({
        uid: referenceUid,
      });

      if (!reference) {
        throw new NotFoundException(
          `can't get reference with the uid ${referenceUid}.`,
        );
      }

      if (product.reference.id !== reference.id) {
        // check if already exists a product for the reference
        const existingProductByReference =
          await this.prismaService.product.findFirst({
            where: { referenceId: reference.id },
          });

        if (existingProductByReference) {
          throw new ConflictException(
            `product already exists for reference with uid ${referenceUid}`,
          );
        }
      }
    }

    // update the product

    const { costPrice, sellPrice, salePrice, stock } = input;

    const updated = await this.prismaService.product.update({
      where: {
        id: product.id,
      },
      data: {
        costPrice,
        sellPrice,
        salePrice,
        stock,
        updatedAt: new Date(),
      },
      include: {
        reference: {
          select: {
            id: true,
          },
        },
      },
    });

    return {
      ...product,
      ...updated,
    } as any;
  }

  public async delete(input: GetOneProductInput) {
    const { uid } = input;

    const product = await this.getOne(input);

    if (!product) {
      throw new NotFoundException(`can't get product with the uid ${uid}.`);
    }

    // delete the product
    await this.prismaService.product.delete({
      where: {
        id: product.id,
      },
    });

    return product as any;
  }

  /* CRUD LOGIC */
}
