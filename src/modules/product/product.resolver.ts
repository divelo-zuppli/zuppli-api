import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Product } from './models/product.model';
import { Reference } from '../reference/models/reference.model';

import { ProductService } from './product.service';

import { CreateProductInput } from './dto/create-product-input.dto';
import { GetOneProductInput } from './dto/get-one-product-input.dto';
import { ProductLoaders } from './product.loaders';
import { GetAllProductsInput } from './dto/get-all-products-input.dto';
import { UpdateProductInput } from './dto/update-reference-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly service: ProductService,
    private readonly loaders: ProductLoaders,
  ) {}

  /* CRUD LOGIC */

  @Mutation(() => Product, { name: 'createProduct' })
  create(
    @Args('createProductInput') input: CreateProductInput,
  ): Promise<Product> {
    return this.service.create(input);
  }

  @Query(() => Product, { name: 'getProduct', nullable: true })
  getOne(
    @Args('getOneProductInput') input: GetOneProductInput,
  ): Promise<Product> {
    return this.service.getOne(input);
  }

  @Query(() => [Product], { name: 'getAllProducts' })
  getAll(
    @Args('getAllProductsInput') input: GetAllProductsInput,
  ): Promise<Product[]> {
    return this.service.getAll(input);
  }

  @Mutation(() => Product, { name: 'updateProduct' })
  update(
    @Args('getOneProductInput') getOneProductInput: GetOneProductInput,
    @Args('updateProductInput') input: UpdateProductInput,
  ) {
    return this.service.update(getOneProductInput, input);
  }

  @Mutation(() => Product, { name: 'deleteProduct' })
  delete(@Args('getOneProductInput') input: GetOneProductInput) {
    return this.service.delete(input);
  }

  /* CRUD LOGIC */

  /* RESOLVE FIELDS LOGIC */

  @ResolveField(() => Reference, { name: 'reference' })
  category(@Parent() parent: Product): Promise<Reference> {
    const value: any = parent.reference;

    if (!value) return Promise.resolve(null);

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchReferences.load(id);
  }

  /* RESOLVE FIELDS LOGIC */
}
