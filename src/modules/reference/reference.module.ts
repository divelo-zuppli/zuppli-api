import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { ReferenceService } from './reference.service';
import { PrismaService } from '../../prisma.service';
import { ReferenceLoaders } from './reference.loaders';
import { ReferenceResolver } from './reference.resolver';

import { CategoryModule } from '../category/category.module';

@Module({
  imports: [ConfigModule.forFeature(appConfig), CategoryModule],
  providers: [
    ReferenceService,
    PrismaService,
    ReferenceLoaders,
    ReferenceResolver,
  ],
  exports: [ReferenceService],
})
export class ReferenceModule {}
