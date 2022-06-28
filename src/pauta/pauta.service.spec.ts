import { PautaService } from './pauta.service';
import { EscolhaService } from '../escolha/escolha.service';
import { PrismaService } from '../services/prisma/prisma.service';
import {
  ONDE_APARECE,
  STATUS_PAUTA,
  TIPO_PAUTA,
  TIPO_VOTANTE,
} from '../shared/enums/pautaEnums';
import { CreatePautaDto } from './dto/create-pauta.dto';
import { UpdatePautaDto } from './dto/update-pauta.dto';
import { S3Service } from '../services/s3/s3.service';

export const pautaTeste = new CreatePautaDto();
pautaTeste.ordem = 1;
pautaTeste.descricao = 'Pauta teste';
pautaTeste.status = STATUS_PAUTA.NAO_INICIADA;
pautaTeste.tipoVoto = TIPO_PAUTA.APROVAR_REJEITAR_ABSTER;
pautaTeste.tipoAcaoVotante = TIPO_VOTANTE.ON;
pautaTeste.ondeAparece = ONDE_APARECE.BVD_E_ASSEMBLEIA;
pautaTeste.abstencao = 'Absteve';
pautaTeste.naoVotou = 'Não Votou';
describe('PautaService', () => {
  let service: PautaService;
  let prismaService: PrismaService;
  let escolhaService: EscolhaService;

  let id = '';

  beforeAll(async () => {
    process.env.DATABASE_URL =
      'mongodb+srv://tenmeetings:4QTSPDIUm2qrh5wE@tenmeetings.ytkqd.mongodb.net/TenMeetingsTEST?retryWrites=true&w=majority';
  });

  beforeEach(async () => {
    prismaService = new PrismaService(new S3Service());
    escolhaService = new EscolhaService(prismaService);
    service = new PautaService(escolhaService, prismaService);
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [PautaService],
    // }).compile();
    //
    // service = module.get<PautaService>(PautaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // // it('Salvar uma pauta', async () => {
  // //   const respostaCriacao = await prismaMock.pauta.create({
  // //     data: pautaTeste,
  // //   });
  // //   id = respostaCriacao.id;
  // //   await expect(respostaCriacao).toEqual(
  // //     expect.objectContaining({
  // //       ...pautaTeste,
  // //     }),
  // //   );
  // //   console.log(id);
  // // });
  it('Cria pauta com 3 escolhas disponíveis', async () => {
    const respostaCriacao = await service.cadastrarPauta({
      ...pautaTeste,
    });
    id = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...pautaTeste,
      }),
    );
    console.log(id);
  });
  //
  it('Ler a pauta', async () => {
    console.log(id);
    await expect(service.findOne(id)).resolves.toEqual({
      ...pautaTeste,
      assembleiaId: null,
      id,
    });
  });

  it('Alterar a pauta', async () => {
    console.log(id);
    await expect(
      service.update(id, {
        ...pautaTeste,
        ordem: 1,
        descricao: 'TESTE',
      } as UpdatePautaDto),
    ).resolves.toEqual({
      ...pautaTeste,
      id,
      ordem: 1,
      descricao: 'TESTE',
      assembleiaId: null,
    });
  });
  // it('Tabular Pauta', async () => {
  //   await service.tabulaPauta('62a8c3afc0b401b9632633bd');
  //   //   await expect(
  //   //       service.update(id, {
  //   //         ...pautaTeste,
  //   //         ordem: 1,
  //   //         descricao: 'TESTE',
  //   //       } as UpdatePautaDto),
  //   //   ).resolves.toEqual({
  //   //     ...pautaTeste,
  //   //     id,
  //   //     ordem: 1,
  //   //     descricao: 'TESTE',
  //   //     assembleiaId: null,
  //   //   });
  // });

  it('Deletar pauta criada', async () => {
    // console.log(service.remove('629fa7d76ab47ca3ab74618d'));
    const resposta = service.remove(id);

    await expect(resposta).toBeDefined();
  });
});
