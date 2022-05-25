import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BusinessService } from './business.service';
import { BusinessResolver } from './business.resolver';
import { PrismaService } from '../../prisma.service';
import { BusinessLoaders } from './business.loaders';

import { UserModule } from '../user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [
    PrismaService,
    BusinessService,
    BusinessLoaders,
    BusinessResolver,
  ],
})
export class BusinessModule {}
