import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaService } from './empresa.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { Empresa } from './entities/empresa.entity';
import { S3Service } from '../services/s3/s3.service';

export const empresaTeste = new Empresa();
empresaTeste.nomeFantasia = 'Nome 01';
empresaTeste.cnpj = '123456';
empresaTeste.email = 'teste@gmail.com';
empresaTeste.razaoSocial = 'Empresa';

const result = [empresaTeste];
describe('EmpresaService', () => {
  let service: EmpresaService;

  let id = '';

  beforeAll(async () => {
    process.env.DATABASE_URL =
      'mongodb+srv://tenmeetings:4QTSPDIUm2qrh5wE@tenmeetings.ytkqd.mongodb.net/TenMeetingsTEST?retryWrites=true&w=majority';
  });

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [EmpresaService],
    // }).compile();
    //
    // service = module.get<EmpresaService>(EmpresaService);
    service = new EmpresaService(new PrismaService(new S3Service()));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Salvar um empresa', async () => {
    const respostaCriacao = await service.create(empresaTeste);
    id = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...empresaTeste,
        id,
      }),
    );
    console.log(id);
  });

  it('Ler o empresa', async () => {
    console.log(id);
    await expect(service.findOne(id)).resolves.toEqual({
      ...empresaTeste,
      id,
    });
  });

  it('Alterar o empresa', async () => {
    console.log(id);
    await expect(
      service.update(id, {
        ...empresaTeste,
        nomeFantasia: 'Fulano',
      }),
    ).resolves.toEqual({
      ...empresaTeste,
      id,
      nomeFantasia: 'Fulano',
    });
  });

  it('Deletar empresa', async () => {
    console.log(id);
    await expect(service.remove(id)).resolves.toBeDefined();
  });
});
