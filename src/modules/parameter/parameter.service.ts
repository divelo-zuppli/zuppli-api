import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';

import { GetValueInput } from './dto/get-value-input.dto';

@Injectable()
export class ParameterService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getValue(input: GetValueInput): Promise<string> {
    const { name } = input;

    const parameter = await this.prismaService.parameter.findUnique({
      where: { name },
    });

    if (!parameter) {
      throw new NotFoundException(`parameter with name "${name}" not found.`);
    }

    return parameter.value;
  }
}
