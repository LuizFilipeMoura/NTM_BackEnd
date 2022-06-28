import { Test, TestingModule } from '@nestjs/testing';
import { FuncionarioService } from './funcionario.service';
import { EscolhaService } from '../escolha/escolha.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { S3Service } from '../services/s3/s3.service';

describe('FuncionarioService', () => {
  let service: FuncionarioService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [FuncionarioService],
    // }).compile();
    //
    // service = module.get<FuncionarioService>(FuncionarioService);
    service = new FuncionarioService(new PrismaService(new S3Service()));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
