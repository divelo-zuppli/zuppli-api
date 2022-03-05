import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Business } from './models/business.model';

import { BusinessService } from './business.service';

import { CreateBusinessInput } from './dto/create-business-input.dto';
import { GetOneBusinessInput } from './dto/get-one-business-input.dto';
import { GetAllBusinessInput } from './dto/get-all-business-input.dto';
import { UpdateBusinessInput } from './dto/update-business-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Business)
export class BusinessResolver {
  constructor(private readonly service: BusinessService) {}

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

  @Query(() => [Business], { name: 'getAllBusiness' })
  getAll(
    @Args('getAllBusinessInput') input: GetAllBusinessInput,
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
}
