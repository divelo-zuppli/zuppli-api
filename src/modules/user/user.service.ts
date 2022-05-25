import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BasicAclService } from 'nestjs-basic-acl-sdk';

import { User } from './models/user.model';
import { Business } from '../business/models/business.model';

import { PrismaService } from '../../prisma.service';
import { ParameterService } from '../parameter/parameter.service';

import { CreateUserInput } from './dto/create-user-input.dto';
import { CreateUserFromAuthUidInput } from './dto/create.user-from-auth-uid-input.dto';
import { SendUserResetPasswordEmail } from './dto/send-user-reset-password-email-input.dto';
import { VoidOutput } from './dto/void-output.dto';
import { ChangeUserPasswordInput } from './dto/change-user-password-input.dto';
import { ChangeUserEmailInput } from './dto/change-user-email-input.dto';
import { ChangeUserPhoneNumberInput } from './dto/change-user-phone-number-input.dto';
import { GetOneUserInput } from './dto/get-one-user-input.dto';
import { GetAllUsersInput } from './dto/get-all-users-input.dto';
import { CreateUserFromAdminInput } from './dto/create-user-from-admin-input.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly basicAclService: BasicAclService,
    private readonly parameterService: ParameterService,
  ) {}

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

      return createdUser as User;
    } catch (error) {
      Logger.warn('deleting the user in ACL', UserService.name);

      await this.basicAclService.deleteUser({
        authUid: aclUser.authUid,
      });
    }
  }

  public async createFromAuthUid(
    createUserFromAuthUidInput: CreateUserFromAuthUidInput,
  ): Promise<User> {
    const {
      authUid,
      email,
      fullName = 'No assigned',
      phoneNumber,
    } = createUserFromAuthUidInput;

    const existingByAuthUid = await this.prismaService.user.findUnique({
      where: { authUid },
    });

    if (existingByAuthUid) {
      throw new ConflictException(
        `the user with authUid ${authUid} already exist.`,
      );
    }

    const roleCode = await this.parameterService.getValue({
      name: 'BASIC_ACL_CUSTOMER_ROLE_CODE',
    });

    const aclUser = await this.basicAclService.createUser({
      authUid,
      roleCode,
      phone: phoneNumber ? `+57${phoneNumber}` : undefined,
      sendEmail: true,
      emailTemplateParams: {
        fullName,
      },
    });

    try {
      const { authUid } = aclUser;

      const created = await this.prismaService.user.create({
        data: {
          authUid,
          email,
          phoneNumber,
          fullName,
        },
      });

      return created as User;
    } catch (error) {
      Logger.warn('deleting the user in ACL', UserService.name);

      await this.basicAclService.deleteUser({
        authUid: aclUser.authUid,
      });

      throw error;
    }
  }

  public async createFromAdmin(input: CreateUserFromAdminInput): Promise<User> {
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

    const { password, fullName, roleCode } = input;

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

      return createdUser as User;
    } catch (error) {
      Logger.warn('deleting the user in ACL', UserService.name);

      await this.basicAclService.deleteUser({
        authUid: aclUser.authUid,
      });
    }
  }

  public async getOne(input: GetOneUserInput): Promise<User> {
    const { authUid } = input;

    const existingUser = await this.prismaService.user.findUnique({
      where: { authUid },
    });

    return existingUser as User;
  }

  public async getAll(input: GetAllUsersInput): Promise<User[]> {
    const { limit, skip = 0, q } = input;

    const users = await this.prismaService.user.findMany({
      where: {
        email: {
          contains: q,
        },
      },
      take: limit,
      skip: skip,
    });

    return users as any;
  }

  public async getByIds(masterIds: number[]): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: masterIds,
        },
      },
    });

    return users as any;
  }

  public async businesses(parent: User): Promise<Business[]> {
    const { id } = parent;

    const { businesses } = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        businesses: true,
      },
    });

    return businesses as any[];
  }

  public async sendResetPasswordEmail(
    input: SendUserResetPasswordEmail,
  ): Promise<VoidOutput> {
    const { email } = input;

    await this.basicAclService.sendResetPasswordEmail({
      email,
    });

    return {
      message: 'email message was sent',
    };
  }

  public async changePassword(input: ChangeUserPasswordInput): Promise<User> {
    const { authUid } = input;

    const existingUser = await this.prismaService.user.findUnique({
      where: { authUid },
    });

    if (!existingUser) {
      throw new NotFoundException(`user with authUid ${authUid} not found.`);
    }

    const { oldPassword, newPassword } = input;

    await this.basicAclService.changePassword({
      authUid: existingUser.authUid,
      oldPassword,
      newPassword,
      emailTemplateParams: {
        fullName: existingUser.fullName,
      },
    });

    return existingUser as User;
  }

  public async changeEmail(input: ChangeUserEmailInput): Promise<User> {
    const { authUid } = input;

    const existingUser = await this.prismaService.user.findUnique({
      where: { authUid },
    });

    if (!existingUser) {
      throw new NotFoundException(`user with authUid ${authUid} not found.`);
    }

    const { email } = input;

    await this.basicAclService.changeEmail({
      authUid: existingUser.authUid,
      email,
      emailTemplateParams: {
        fullName: existingUser.fullName,
      },
    });

    const updatedUser = await this.prismaService.user.update({
      data: { email },
      where: { authUid },
    });

    return updatedUser as User;
  }

  public async changePhoneNumber(
    input: ChangeUserPhoneNumberInput,
  ): Promise<User> {
    const { authUid } = input;

    const existingUser = await this.prismaService.user.findUnique({
      where: { authUid },
    });

    if (!existingUser) {
      throw new NotFoundException(`user with authUid ${authUid} not found.`);
    }

    const { phoneNumber } = input;

    // change the phone in the ACL
    await this.basicAclService.changePhone({
      authUid: existingUser.authUid,
      phone: `+57${phoneNumber}`,
    });

    const updatedUser = await this.prismaService.user.update({
      data: { phoneNumber },
      where: { authUid },
    });

    return updatedUser as User;
  }
}
