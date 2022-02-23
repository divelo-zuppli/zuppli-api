import { Injectable } from '@nestjs/common';

import { Attachment } from './models/attachment.model';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class AttachmentService {
  constructor(private readonly prismaService: PrismaService) {}

  /* RESOLVE FIELDS LOGIC */
  public async getByIds(masterIds: number[]): Promise<Attachment[]> {
    const references = await this.prismaService.attachment.findMany({
      where: {
        id: {
          in: masterIds,
        },
      },
    });

    return references as any;
  }
  /* RESOLVE FIELDS LOGIC */
}
