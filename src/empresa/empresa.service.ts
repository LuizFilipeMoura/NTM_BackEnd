import { Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class EmpresaService {
  constructor(private prisma: PrismaService) {}

  create(createEmpresaDto: CreateEmpresaDto) {
    return this.prisma.empresa.create({
      data: createEmpresaDto,
    });
  }

  async findAll() {
    return await this.prisma.empresa.findMany();
  }

  findOne(id: string) {
    return this.prisma.empresa.findUnique({ where: { id } });
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    return await this.prisma.empresa.update({
      where: { id },
      data: updateEmpresaDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.empresa.delete({ where: { id } });
  }
}
