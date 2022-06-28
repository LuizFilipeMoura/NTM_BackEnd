import { Test, TestingModule } from '@nestjs/testing';
import { AssembleiaService } from './assembleia.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { Assembleia } from './entities/assembleia.entity';
import { CreateAssembleiaDto } from './dto/create-assembleia.dto';
import { S3Service } from '../services/s3/s3.service';

export const assembleiaTeste = new CreateAssembleiaDto();
assembleiaTeste.nome = 'Assembleia TESTE';
assembleiaTeste.finalidade = 2;

assembleiaTeste.dataFim = null;
assembleiaTeste.dataFimInscricoes = null;
assembleiaTeste.dataInicio = null;
assembleiaTeste.horaInicio = null;
assembleiaTeste.dataInicioInscricoes = null;
assembleiaTeste.tipoPresenca = null;

assembleiaTeste.ehAGOE = null;
assembleiaTeste.status = null;
assembleiaTeste.videoconferencia = null;

describe('AssembleiaService', () => {
  let service: AssembleiaService;

  let id = '';
  beforeAll(async () => {
    process.env.DATABASE_URL =
      'mongodb+srv://tenmeetings:4QTSPDIUm2qrh5wE@tenmeetings.ytkqd.mongodb.net/TenMeetingsTEST?retryWrites=true&w=majority';
  });

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [AssembleiaService],
    // }).compile();
    //
    // service = module.get<AssembleiaService>(AssembleiaService);
    service = new AssembleiaService(new PrismaService(new S3Service()));
  });

  it('should be defined', async () => {
    console.log(await service.findAll());
    expect(service).toBeDefined();
  });

  it('Deveria salvar uma assembleiaTeste', async () => {
    const respostaCriacao = await service.create(
      assembleiaTeste as CreateAssembleiaDto,
    );
    id = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...assembleiaTeste,
      }),
    );
    console.log(id);
  });
  it('Ler a assembleiaTeste criada', async () => {
    await expect(service.findOne(id)).resolves.toEqual({
      ...assembleiaTeste,
      id,
      empresaId: null,
    });
  });
  it('Alterar a assembleiaTeste criada', async () => {
    await expect(
      service.update(id, { nome: 'Outra assembleiaTeste', finalidade: 5 }),
    ).resolves.toEqual({
      ...assembleiaTeste,
      id,
      nome: 'Outra assembleiaTeste',
      finalidade: 5,
      empresaId: null,
    });
  });
  it('Deletar assembleiaTeste criada', async () => {
    await expect(service.remove(id)).resolves.toEqual({
      ...assembleiaTeste,
      id,
      nome: 'Outra assembleiaTeste',
      finalidade: 5,
      empresaId: null,
    });
  });
});
