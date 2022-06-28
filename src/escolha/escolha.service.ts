import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateEscolhaDto } from './dto/create-escolha.dto';
import { UpdateEscolhaDto } from './dto/update-escolha.dto';

@Injectable()
export class EscolhaService {
  constructor(private prisma: PrismaService) {}

  create(createEscolhaDto: CreateEscolhaDto) {
    return this.prisma.escolha.create({ data: createEscolhaDto });
  }

  async findAll() {
    return await this.prisma.escolha.findMany();
  }

  async buscaVotos(escolhaId: string) {
    return await this.prisma.voto.findMany({
      where: { escolhaId },
      include: { participante: true, escolha: true },
    });
  }

  async findOne(id: string) {
    return await this.prisma.escolha.findUnique({
      where: { id },
    });
  }

  // recebe id das escolhas e o objeto escolhas atualizado
  async update(id: string, updateEscolhaDto: UpdateEscolhaDto) {
    // apagado para não substituir id antigo
    delete updateEscolhaDto.id;

    // inserir novos dados no database
    return await this.prisma.escolha.update({
      where: { id },
      data: updateEscolhaDto,
    });
  }

  async remove(id: string) {
    return this.prisma.escolha.delete({ where: { id } });
  }
}
