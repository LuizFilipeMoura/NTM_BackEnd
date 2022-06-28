import { Injectable } from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class FuncionarioService {
  constructor(private prisma: PrismaService) {}

  create(createFuncionarioDto: CreateFuncionarioDto) {
    return this.prisma.funcionario.create({
      data: createFuncionarioDto,
    });
  }

  async findAll() {
    return await this.prisma.funcionario.findMany();
  }

  findOne(id: string) {
    return this.prisma.funcionario.findUnique({ where: { id } });
  }

  async update(id: string, updateFuncionarioDto: UpdateFuncionarioDto) {
    return await this.prisma.funcionario.update({
      where: { id },
      data: updateFuncionarioDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.funcionario.delete({ where: { id } });
  }
}
