import { Module } from '@nestjs/common';

import { ReferenceService } from './reference.service';
import { PrismaService } from '../../prisma.service';
import { ReferenceLoaders } from './reference.loaders';
import { ReferenceResolver } from './reference.resolver';

import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CategoryModule],
  providers: [
    ReferenceService,
    PrismaService,
    ReferenceLoaders,
    ReferenceResolver,
  ],
  exports: [ReferenceService],
})
export class ReferenceModule {}
