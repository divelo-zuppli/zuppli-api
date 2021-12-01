import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Public } from 'nestjs-basic-acl-sdk';

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
import { CreateUserFromAuthUidInput } from './dto/create.user-from-auth-uid-input.dto';
import { VoidOutput } from './dto/void-output.dto';
import { SendUserResetPasswordEmail } from './dto/send-user-reset-password-email-input.dto';
import { ChangeUserPasswordInput } from './dto/change-user-password-input.dto';
import { ChangeUserEmailInput } from './dto/change-user-email-input.dto';
import { ChangeUserPhoneNumberInput } from './dto/change-user-phone-number-input.dto';
import { GetOneUserInput } from './dto/get-one-user-input.dto';

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

  @Public()
  @Mutation(() => User, { name: 'createUser' })
  public create(
    @Args('createUserInput') input: CreateUserInput,
  ): Promise<User> {
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
}
