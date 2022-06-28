import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../services/prisma/prisma.service';
import { TIPO_PARTICIPANTE } from '../shared/enums/participanteEnums';
import { UpdateAssembleiaDto } from './dto/update-assembleia.dto';
import { CreateAssembleiaDto } from './dto/create-assembleia.dto';

@Injectable()
export class AssembleiaService {
  constructor(private prisma: PrismaService) {}

  create(createAssembleiaDto: CreateAssembleiaDto) {
    return this.prisma.assembleia.create({ data: createAssembleiaDto });
  }
  // async teste() {
  //   await this.$disconnect();
  //   this.get
  //   await this.$connect();
  // }

  async findAll() {
    console.log(await this.prisma.assembleia.findMany());
    return await this.prisma.assembleia.findMany();
  }

  findOne(id: string) {
    return this.prisma.assembleia.findUnique({
      where: { id },
      // include: { pautas: true },
    });
  }

  findPautas(assembleiaId: string) {
    return this.prisma.pauta.findMany({
      where: { assembleiaId },
      include: {
        escolhas: {
          orderBy: {
            ordem: 'asc',
          },
        },
      },
    });
  }
  findParticipantes(assembleiaId: string) {
    return this.prisma.participante.findMany({ where: { assembleiaId } });
  }
  findRepresentantes(assembleiaId: string) {
    return this.prisma.participante.findMany({
      where: {
        AND: [
          {
            assembleiaId: {
              equals: assembleiaId,
            },
          },
          {
            tipoParticipante: {
              equals: TIPO_PARTICIPANTE.Representante,
            },
          },
        ],
      },
    });
  }
  findOutorgantes(assembleiaId: string, representanteId: string) {
    return this.prisma.participante.findMany({
      where: {
        AND: [
          {
            assembleiaId: {
              equals: assembleiaId,
            },
          },
          {
            representanteId: {
              equals: representanteId,
            },
          },
        ],
      },
    });
  }

  async update(id: string, updateAssembleiaDto: UpdateAssembleiaDto) {
    return await this.prisma.assembleia.update({
      where: { id },
      data: updateAssembleiaDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.assembleia.delete({ where: { id } });
  }
}
