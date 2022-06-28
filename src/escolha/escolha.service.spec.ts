import { EscolhaService } from './escolha.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { Escolha } from './entities/escolha.entity';
import { CreateEscolhaDto } from './dto/create-escolha.dto';
import { S3Service } from '../services/s3/s3.service';

export const escolhaTeste = new CreateEscolhaDto();
escolhaTeste.opcao = 'Teste opcao';
escolhaTeste.ordem = 1;
escolhaTeste.totalDeVotos = null;

describe('EscolhaService', () => {
  let service: EscolhaService;

  let id = '';

  beforeAll(async () => {
    process.env.DATABASE_URL =
      'mongodb+srv://tenmeetings:4QTSPDIUm2qrh5wE@tenmeetings.ytkqd.mongodb.net/TenMeetingsTEST?retryWrites=true&w=majority';
  });

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [EscolhaService],
    // }).compile();
    //
    // service = module.get<EscolhaService>(EscolhaService);
    service = new EscolhaService(new PrismaService(new S3Service()));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Salvar uma escolha', async () => {
    const respostaCriacao = await service.create(escolhaTeste);
    id = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...escolhaTeste,
        id,
      }),
    );
    console.log(id);
  });

  it('Ler a escolha', async () => {
    console.log(id);
    await expect(service.findOne(id)).resolves.toEqual({
      ...escolhaTeste,
      id,
      pautaId: null,
    });
  });

  it('Alterar a escolha', async () => {
    console.log(id);
    await expect(
      service.update(id, {
        ...escolhaTeste,
        ordem: 1,
        opcao: 'TESTE',
      }),
    ).resolves.toEqual({
      ...escolhaTeste,
      id,
      ordem: 1,
      opcao: 'TESTE',
      pautaId: null,
    });
  });

  it('Deletar escolha criada', async () => {
    console.log(id);
    await expect(service.remove(id)).resolves.toBeDefined();
  });
});
