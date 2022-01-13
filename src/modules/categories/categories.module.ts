import { Module } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma.service';
import { CategoryLoaders } from './category.loaders';
import { CategoriesResolver } from './categories.resolver';

@Module({
  providers: [
    CategoriesService,
    PrismaService,
    CategoryLoaders,
    CategoriesResolver,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
