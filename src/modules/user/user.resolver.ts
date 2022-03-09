import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Public } from 'nestjs-basic-acl-sdk';

import { User } from './models/user.model';
import { Business } from '../business/models/business.model';

import { UserService } from './user.service';

import { CreateUserInput } from './dto/create-user-input.dto';
import { CreateUserFromAuthUidInput } from './dto/create.user-from-auth-uid-input.dto';
import { VoidOutput } from './dto/void-output.dto';
import { SendUserResetPasswordEmail } from './dto/send-user-reset-password-email-input.dto';
import { ChangeUserPasswordInput } from './dto/change-user-password-input.dto';
import { ChangeUserEmailInput } from './dto/change-user-email-input.dto';
import { ChangeUserPhoneNumberInput } from './dto/change-user-phone-number-input.dto';
import { GetOneUserInput } from './dto/get-one-user-input.dto';
import { GetAllUsersInput } from './dto/get-all-users-input.dto';
import { CreateUserFromAdminInput } from './dto/create-user-from-admin-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Public()
  @Mutation(() => User, { name: 'createUser' })
  create(@Args('createUserInput') input: CreateUserInput): Promise<User> {
    return this.service.create(input);
  }

  @Public()
  @Mutation(() => User, { name: 'createUserFromAuthUid' })
  createFromAuthUid(
    @Args('createUserFromAuthUidInput')
    input: CreateUserFromAuthUidInput,
  ): Promise<User> {
    return this.service.createFromAuthUid(input);
  }

  @Mutation(() => User, { name: 'createUserFromAdmin' })
  createFromAdmin(
    @Args('createUserFromAdminInput')
    input: CreateUserFromAdminInput,
  ): Promise<User> {
    return this.service.createFromAdmin(input);
  }

  @Query(() => [User], { name: 'getAllUsers' })
  getAll(@Args('getAllUsersInput') input: GetAllUsersInput): Promise<User[]> {
    return this.service.getAll(input);
  }

  @Query(() => User, { name: 'getUser' })
  getOne(@Args('getOneUserInput') input: GetOneUserInput): Promise<User> {
    return this.service.getOne(input);
  }

  @Public()
  @Mutation(() => VoidOutput, { name: 'sendUserResetPasswordEmail' })
  sendResetPasswordEmail(
    @Args('sendUserResetPasswordEmail') input: SendUserResetPasswordEmail,
  ): Promise<VoidOutput> {
    return this.service.sendResetPasswordEmail(input);
  }

  @Mutation(() => User, { name: 'changeUserPassword' })
  changePassword(
    @Args('changeUserPasswordInput') input: ChangeUserPasswordInput,
  ): Promise<User> {
    return this.service.changePassword(input);
  }

  @Mutation(() => User, { name: 'changeUserEmail' })
  changeEmail(
    @Args('changeUserEmailInput') input: ChangeUserEmailInput,
  ): Promise<User> {
    return this.service.changeEmail(input);
  }

  @Mutation(() => User, { name: 'changeUserPhoneNumber' })
  changePhoneNumber(
    @Args('changeUserPhoneNumberInput') input: ChangeUserPhoneNumberInput,
  ): Promise<User> {
    return this.service.changePhoneNumber(input);
  }

  /* RESOLVE FIELDS LOGIC */

  @ResolveField(() => [Business], { name: 'businesses' })
  businesses(@Parent() parent: User): Promise<Business[]> {
    return this.service.businesses(parent);
  }

  /* RESOLVE FIELDS LOGIC */
}
