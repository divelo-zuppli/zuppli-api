import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Business } from './models/business.model';
import { User } from '../user/models/user.model';

import { BusinessService } from './business.service';

import { CreateBusinessInput } from './dto/create-business-input.dto';
import { GetOneBusinessInput } from './dto/get-one-business-input.dto';
import { GetAllBusinessesInput } from './dto/get-all-businesses-input.dto';
import { UpdateBusinessInput } from './dto/update-business-input.dto';
import { BusinessLoaders } from './business.loaders';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Business)
export class BusinessResolver {
  constructor(
    private readonly service: BusinessService,
    private readonly loaders: BusinessLoaders,
  ) {}

  /* CRUD LOGIC */
  @Mutation(() => Business, { name: 'createBusiness' })
  create(
    @Args('createBusinessInput') input: CreateBusinessInput,
  ): Promise<Business> {
    return this.service.create(input);
  }

  @Query(() => Business, { name: 'getBusiness', nullable: true })
  getOne(
    @Args('getOneBusinessInput') input: GetOneBusinessInput,
  ): Promise<Business> {
    return this.service.getOne(input);
  }

  @Query(() => [Business], { name: 'getAllBusinesses' })
  getAll(
    @Args('getAllBusinessesInput') input: GetAllBusinessesInput,
  ): Promise<Business[]> {
    return this.service.getAll(input);
  }

  @Mutation(() => Business, { name: 'updateBusiness' })
  update(
    @Args('getOneBusinessInput') getOneBusinessInput: GetOneBusinessInput,
    @Args('updateBusinessInput') input: UpdateBusinessInput,
  ) {
    return this.service.update(getOneBusinessInput, input);
  }

  @Mutation(() => Business, { name: 'deleteBusiness' })
  delete(@Args('getOneBusinessInput') input: GetOneBusinessInput) {
    return this.service.delete(input);
  }
  /* CRUD LOGIC */

  /* RESOLVE FIELDS LOGIC */

  @ResolveField(() => User, { name: 'user' })
  user(@Parent() parent: Business): Promise<User> {
    const value: any = parent.user || parent.userId;

    if (!value) return Promise.resolve(undefined);

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchUsers.load(id);
  }

  /* RESOLVE FIELDS LOGIC */
}
