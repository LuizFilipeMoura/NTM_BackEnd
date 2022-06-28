import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { TIPO_PARTICIPANTE } from '../shared/enums/participanteEnums';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { CreateParticipanteDto } from './dto/create-participante.dto';

@Injectable()
export class ParticipanteService {
  constructor(private prisma: PrismaService) {}
  create(createParticipanteDto: CreateParticipanteDto) {
    return this.prisma.participante.create({ data: createParticipanteDto });
  }

  async findAll() {
    return await this.prisma.participante.findMany();
  }
  async buscarPorCPFCNPJ(cpfcnpj: string) {
    return await this.prisma.participante.findFirst({
      where: { cpfcnpj },
    });
  }

  async findManyOutorgantes(id: string) {
    return await this.prisma.participante.findMany({
      where: {
        representanteId: {
          equals: id,
        },
      },
    });
  }

  async findManyRepresentantes() {
    return await this.prisma.participante.findMany({
      where: {
        tipoParticipante: {
          equals: TIPO_PARTICIPANTE.Representante,
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.participante.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateParticipanteDto: UpdateParticipanteDto) {
    return await this.prisma.participante.update({
      where: { id },
      data: updateParticipanteDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.participante.delete({ where: { id } });
  }
}
