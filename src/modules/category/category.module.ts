import { Module } from '@nestjs/common';

import { CategoryService } from './category.service';
import { PrismaService } from '../../prisma.service';
import { CategoryLoaders } from './category.loaders';
import { CategoryResolver } from './category.resolver';

@Module({
  providers: [
    CategoryService,
    PrismaService,
    CategoryLoaders,
    CategoryResolver,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
