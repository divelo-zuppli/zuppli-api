import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { ParameterService } from './parameter.service';

@Module({
  providers: [ParameterService, PrismaService],
  exports: [ParameterService],
})
export class ParameterModule {}
