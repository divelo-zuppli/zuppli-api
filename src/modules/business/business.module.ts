import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BusinessService } from './business.service';
import { BusinessResolver } from './business.resolver';
import { PrismaService } from '../../prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [BusinessService, BusinessResolver, PrismaService],
})
export class BusinessModule {}
