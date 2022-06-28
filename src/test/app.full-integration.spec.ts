import { Test, TestingModule } from '@nestjs/testing';
import { AssembleiaService } from '../assembleia/assembleia.service';
import { assembleiaTeste } from '../assembleia/assembleia.service.spec';
import { pautaTeste } from '../pauta/pauta.service.spec';
import { participanteTeste } from '../participante/participante.service.spec';
import { PautaService } from '../pauta/pauta.service';
import { VotoService } from '../voto/voto.service';
import { EscolhaService } from '../escolha/escolha.service';
import { ParticipanteService } from '../participante/participante.service';
import { escolhaTeste } from '../escolha/escolha.service.spec';
import { votoTeste } from '../voto/voto.service.spec';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateAssembleiaDto } from '../assembleia/dto/create-assembleia.dto';
import { CreateVotoDto } from '../voto/dto/create-voto.dto';
import { S3Service } from '../services/s3/s3.service';

describe('Full Integration', () => {
  let assembleiaService: AssembleiaService;
  let pautaService: PautaService;
  let votoService: VotoService;
  let escolhaService: EscolhaService;
  let participanteService: ParticipanteService;
  let prismaService: PrismaService;

  let assembleiaId = '';
  let pautaId = '';
  let pauta2Id = '';
  let votoId = '';
  let escolhaId = '';
  let participanteId = '';

  beforeAll(async () => {
    process.env.DATABASE_URL =
      'mongodb+srv://tenmeetings:4QTSPDIUm2qrh5wE@tenmeetings.ytkqd.mongodb.net/TenMeetingsTEST?retryWrites=true&w=majority';
  });

  beforeEach(async () => {
    prismaService = new PrismaService(new S3Service());
    assembleiaService = new AssembleiaService(prismaService);
    participanteService = new ParticipanteService(prismaService);
    escolhaService = new EscolhaService(prismaService);
    pautaService = new PautaService(escolhaService, prismaService);

    votoService = new VotoService(prismaService);
  });

  it('should be defined', () => {
    expect(assembleiaService).toBeDefined();
  });
  it('Deveria criar uma assembleia', async () => {
    const respostaCriacao = await assembleiaService.create(
      assembleiaTeste as CreateAssembleiaDto,
    );
    assembleiaId = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...assembleiaTeste,
      }),
    );
  });
  it('Salvar uma pauta dentro dessa assembleia', async () => {
    const respostaCriacao = await pautaService.create({
      ...pautaTeste,
      assembleia: { connect: { id: assembleiaId } },
    });
    pautaId = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...pautaTeste,
        assembleiaId,
      }),
    );
  });
  it('Salvar uma pauta QUE APROVA REJEITA E SE ABSTEM', async () => {
    const respostaCriacao = await pautaService.cadastrarPauta({
      ...pautaTeste,
      assembleia: { connect: { id: assembleiaId } },
    });
    pauta2Id = respostaCriacao.id;
    console.log(respostaCriacao.id);

    await expect(
      (
        await pautaService.findEscolhas(respostaCriacao.id)
      ).length,
    ).toEqual(3);
  });
  it('Salvar uma escolha dentro dessa pauta', async () => {
    const respostaCriacao = await escolhaService.create({
      ...escolhaTeste,
      pauta: { connect: { id: pautaId } },
    });
    escolhaId = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...escolhaTeste,
        pautaId,
      }),
    );
  });
  it('Buscar pela escolha dentro da pauta', async () => {
    await expect((await pautaService.findEscolhas(pautaId))[0]).toEqual(
      expect.objectContaining({
        ...escolhaTeste,
        id: escolhaId,
        pautaId,
      }),
    );
  });
  it('Buscar pela Pauta dentro da assembleia', async () => {
    await expect((await assembleiaService.findPautas(assembleiaId))[0]).toEqual(
      expect.objectContaining({
        ...pautaTeste,
        id: pautaId,
        assembleiaId,
      }),
    );
  });

  it('Salvar um participante dentro dessa assembleia', async () => {
    const respostaCriacao = await participanteService.create({
      ...participanteTeste,
      assembleia: { connect: { id: assembleiaId } },
    });
    participanteId = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...participanteTeste,
        assembleiaId,
      }),
    );
  });
  it('Buscar pelo Participante dentro da assembleia', async () => {
    await expect(
      (
        await assembleiaService.findParticipantes(assembleiaId)
      )[0],
    ).toEqual(
      expect.objectContaining({
        ...participanteTeste,
        id: participanteId,
        assembleiaId,
      }),
    );
  });
  it('Salvar um voto pra um participante dentro de uma escolha da pauta', async () => {
    const voto = new CreateVotoDto();
    const respostaCriacao = await votoService.create({
      ...voto,
      quantidadeVotos: participanteTeste.quantidadeON,
      participante: { connect: { id: participanteId } },
      escolha: { connect: { id: escolhaId } },
    });
    votoId = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...votoTeste,
        escolhaId,
        id: respostaCriacao.id,
        participanteId,
        quantidadeVotos: participanteTeste.quantidadeON,
      }).sample,
    );
  });

  it(`Limpa tudo`, async () => {
    await expect(assembleiaService.remove(assembleiaId)).resolves.toEqual({
      ...assembleiaTeste,
      empresaId: null,
      id: assembleiaId,
    });

    await expect(pautaService.remove(pautaId)).resolves.toEqual({
      ...pautaTeste,
      assembleiaId: null,
      id: pautaId,
    });
    await expect(pautaService.remove(pauta2Id)).resolves.toEqual({
      ...pautaTeste,
      assembleiaId: null,

      id: pauta2Id,
    });

    await expect(escolhaService.remove(escolhaId)).resolves.toEqual({
      ...escolhaTeste,
      pautaId: null,

      id: escolhaId,
    });
    await expect(votoService.remove(votoId)).resolves.toEqual({
      ...votoTeste,
      id: votoId,
      escolhaId: null,
      participanteId: null,

      quantidadeVotos: participanteTeste.quantidadeON,
    });
    await expect(participanteService.remove(participanteId)).resolves.toEqual({
      ...participanteTeste,
      assembleiaId: null,
      bvdId: null,
      representanteId: null,
      id: participanteId,
    });
  });
});
