import { Test, TestingModule } from '@nestjs/testing';
import { FuncionarioController } from './funcionario.controller';
import { FuncionarioService } from './funcionario.service';
import { EscolhaService } from '../escolha/escolha.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { EscolhaController } from '../escolha/escolha.controller';
import { S3Service } from '../services/s3/s3.service';

describe('FuncionarioController', () => {
  let controller: FuncionarioController;

  beforeEach(async () => {
    const service = new FuncionarioService(new PrismaService(new S3Service()));
    controller = new FuncionarioController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
