import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicAclModule } from 'nestjs-basic-acl-sdk';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '../../prisma.service';

import { ParameterModule } from '../parameter/parameter.module';

@Module({
  imports: [
    BasicAclModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          companyUid: configService.get<string>('config.acl.companyUid'),
          accessKey: configService.get<string>('config.acl.accessKey'),
        };
      },
    }),
    ParameterModule,
  ],
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService],
})
export class UserModule {}
