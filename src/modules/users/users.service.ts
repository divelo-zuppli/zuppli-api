import Fuse from 'fuse.js';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { BasicAclService } from 'nestjs-basic-acl-sdk';

import {
  AuthResponse,
  ChangePasswordInput,
  ForgetPasswordInput,
  LoginInput,
  PasswordChangeResponse,
  RegisterInput,
  ResetPasswordInput,
  VerifyForgetPasswordTokenInput,
} from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { OldUser } from './entities/user.entity';
import { GetUserArgs } from './dto/get-user.args';
import usersJson from './users.json';
import { paginate } from 'src/common/pagination/paginate';
import { GetUsersArgs, UserPaginator } from './dto/get-users.args';

import { User } from './models/user.model';

import { PrismaService } from '../../prisma.service';

import { CreateUserInput } from './dto/create-user-input.dto';
import { ParameterService } from '../parameter/parameter.service';

const users = plainToClass(OldUser, usersJson);
const options = {
  keys: ['name', 'type.slug', 'categories.slug', 'status'],
  threshold: 0.3,
};
const fuse = new Fuse(users, options);

// TODO: change the service name
@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly basicAclService: BasicAclService,
    private readonly parameterService: ParameterService,
  ) {}

  private users: OldUser[] = users;
  async register(createUserInput: RegisterInput): Promise<AuthResponse> {
    const user: OldUser = {
      id: uuidv4(),
      ...users[0],
      ...createUserInput,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.users.push(user);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
    };
  }
  async login(loginInput: LoginInput): Promise<AuthResponse> {
    console.log(loginInput);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
    };
  }
  async changePassword(
    changePasswordInput: ChangePasswordInput,
  ): Promise<PasswordChangeResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async forgetPassword(
    forgetPasswordInput: ForgetPasswordInput,
  ): Promise<PasswordChangeResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async verifyForgetPasswordToken(
    verifyForgetPasswordTokenInput: VerifyForgetPasswordTokenInput,
  ): Promise<PasswordChangeResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<PasswordChangeResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async getUsers({ text, first, page }: GetUsersArgs): Promise<UserPaginator> {
    const startIndex = (page - 1) * first;
    const endIndex = page * first;
    let data: OldUser[] = this.users;
    if (text?.replace(/%/g, '')) {
      data = fuse.search(text)?.map(({ item }) => item);
    }
    const results = data.slice(startIndex, endIndex);
    return {
      data: results,
      paginatorInfo: paginate(data.length, page, first, results.length),
    };
  }
  public getUser(getUserArgs: GetUserArgs): OldUser {
    return this.users.find((user) => user.id === getUserArgs.id);
  }
  me(): OldUser {
    return this.users[0];
  }

  updateUser(id: number, updateUserInput: UpdateUserInput) {
    return this.users[0];
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // my code

  public async create(input: CreateUserInput): Promise<User> {
    const { email } = input;

    const exisingUserByEmail = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (exisingUserByEmail) {
      throw new ConflictException(
        `already exist an user with the email ${email}.`,
      );
    }

    const { phoneNumber } = input;

    const exisingUserByPhoneNumber = await this.prismaService.user.findUnique({
      where: { phoneNumber },
    });

    if (exisingUserByPhoneNumber) {
      throw new ConflictException(
        `already exist an user with the phone number ${phoneNumber}.`,
      );
    }

    const { password, fullName } = input;

    const roleCode = await this.parameterService.getValue({
      name: 'BASIC_ACL_CUSTOMER_ROLE_CODE',
    });

    const aclUser = await this.basicAclService.createUser({
      email,
      password,
      phone: `+57${phoneNumber}`,
      roleCode: roleCode,
      sendEmail: true,
      emailTemplateParams: {
        fullName,
      },
    });

    try {
      const { authUid } = aclUser;

      const createdUser = await this.prismaService.user.create({
        data: {
          authUid,
          email,
          phoneNumber,
        },
      });

      return createdUser;
    } catch (error) {
      Logger.warn('deleting the user in ACL', UsersService.name);

      await this.basicAclService.deleteUser({
        authUid: aclUser.authUid,
      });
    }
  }
}
