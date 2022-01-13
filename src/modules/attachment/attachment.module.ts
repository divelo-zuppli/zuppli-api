import { Module } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { AttachmentService } from './attachment.service';

@Module({
  providers: [AttachmentService, PrismaService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
