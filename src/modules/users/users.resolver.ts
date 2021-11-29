import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { OldUser } from './entities/user.entity';
import {
  AuthResponse,
  ChangePasswordInput,
  ForgetPasswordInput,
  LoginInput,
  OtpInput,
  OtpLoginInput,
  OtpResponse,
  PasswordChangeResponse,
  RegisterInput,
  ResetPasswordInput,
  SocialLoginInput,
  VerifyForgetPasswordTokenInput,
  VerifyOtpInput,
} from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GetUserArgs } from './dto/get-user.args';
import { GetUsersArgs, UserPaginator } from './dto/get-users.args';
import { SuccessResponse } from 'src/common/dto/success-response.model';
import { ProfileInput } from './dto/create-profile.input';
import { Profile } from './entities/profile.entity';
import { UpdateProfileArgs } from './dto/update-profile.args';

import { User } from './models/user.model';

import { UsersService } from './users.service';

import { CreateUserInput } from './dto/create-user-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly service: UsersService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('input') createUserInput: RegisterInput,
  ): Promise<AuthResponse> {
    return this.service.register(createUserInput);
  }
  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthResponse> {
    return this.service.login(loginInput);
  }
  @Mutation(() => AuthResponse)
  async socialLogin(
    @Args('input') socialLoginInput: SocialLoginInput,
  ): Promise<AuthResponse> {
    console.log(socialLoginInput);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
    };
  }
  @Mutation(() => AuthResponse)
  async otpLogin(
    @Args('input') otpLoginInput: OtpLoginInput,
  ): Promise<AuthResponse> {
    console.log(otpLoginInput);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
    };
  }
  @Mutation(() => SuccessResponse)
  async verifyOtpCode(
    @Args('input') verifyOtpInput: VerifyOtpInput,
  ): Promise<SuccessResponse> {
    console.log(verifyOtpInput);
    return {
      message: 'success',
      success: true,
    };
  }
  @Mutation(() => OtpResponse)
  async sendOtpCode(@Args('input') otpInput: OtpInput): Promise<OtpResponse> {
    console.log(otpInput);
    return {
      message: 'success',
      success: true,
      id: '1',
      provider: 'google',
      phone_number: '+919494949494',
      is_contact_exist: true,
    };
  }

  @Mutation(() => Boolean)
  async logout(): Promise<boolean> {
    return true;
  }

  @Mutation(() => PasswordChangeResponse)
  async changePassword(
    @Args('input') changePasswordInput: ChangePasswordInput,
  ): Promise<PasswordChangeResponse> {
    return this.service.changePassword(changePasswordInput);
  }
  @Mutation(() => PasswordChangeResponse)
  async forgetPassword(
    @Args('input') forgetPasswordInput: ForgetPasswordInput,
  ): Promise<PasswordChangeResponse> {
    return this.service.forgetPassword(forgetPasswordInput);
  }
  @Mutation(() => PasswordChangeResponse)
  async verifyForgetPasswordToken(
    @Args('input')
    verifyForgetPasswordTokenInput: VerifyForgetPasswordTokenInput,
  ): Promise<PasswordChangeResponse> {
    return this.service.verifyForgetPasswordToken(
      verifyForgetPasswordTokenInput,
    );
  }
  @Mutation(() => PasswordChangeResponse)
  async resetPassword(
    @Args('input')
    resetPasswordInput: ResetPasswordInput,
  ): Promise<PasswordChangeResponse> {
    return this.service.resetPassword(resetPasswordInput);
  }

  @Query(() => UserPaginator, { name: 'users' })
  async getUsers(@Args() getUsersArgs: GetUsersArgs): Promise<UserPaginator> {
    return this.service.getUsers(getUsersArgs);
  }

  @Query(() => OldUser, { name: 'me' })
  async me(): Promise<OldUser> {
    return this.service.me();
  }

  @Query(() => OldUser, { name: 'user', nullable: true })
  getUser(@Args() getUserArgs: GetUserArgs): OldUser {
    return this.service.getUser(getUserArgs);
  }
  @Mutation(() => OldUser)
  updateUser(@Args('input') updateUserInput: UpdateUserInput) {
    return this.service.updateUser(updateUserInput.id, updateUserInput);
  }
  @Mutation(() => OldUser)
  activeUser(@Args('id', { type: () => ID }) id: number) {
    console.log(id);
    // return this.service.getUsers(updateUserInput.id);
  }
  @Mutation(() => OldUser)
  banUser(@Args('id', { type: () => ID }) id: number) {
    console.log(id);
    // return this.service.getUsers(updateUserInput.id);
  }

  @Mutation(() => OldUser)
  removeUser(@Args('id', { type: () => ID }) id: number) {
    return this.service.remove(id);
  }
  @Mutation(() => Profile)
  createProfile(@Args('input') profileInput: ProfileInput) {
    console.log(profileInput);
  }
  @Mutation(() => Profile)
  updateProfile(@Args() updateProfileArgs: UpdateProfileArgs) {
    console.log(updateProfileArgs);
  }
  @Mutation(() => Profile)
  deleteProfile(@Args('id', { type: () => ID }) id: number) {
    return this.service.remove(id);
  }

  //

  @Mutation(() => User, { name: 'createUser' })
  public create(
    @Args('createUserInput') input: CreateUserInput,
  ): Promise<User> {
    return this.service.create(input);
  }
}
