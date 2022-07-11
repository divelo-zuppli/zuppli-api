import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { PrismaService } from '../../prisma.service';
import { ProductService } from './product.service';
import { ProductLoaders } from './product.loaders';
import { ProductResolver } from './product.resolver';

import { ReferenceModule } from '../reference/reference.module';

@Module({
  imports: [ConfigModule.forFeature(appConfig), ReferenceModule],
  providers: [PrismaService, ProductService, ProductLoaders, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
