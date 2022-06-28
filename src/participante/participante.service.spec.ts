import { Test, TestingModule } from '@nestjs/testing';
import { ParticipanteService } from './participante.service';

import { PrismaService } from '../services/prisma/prisma.service';
import {
  PARTICIPACAO,
  PERMISSAO,
  TIPO_PARTICIPANTE,
} from '../shared/enums/participanteEnums';
import { Participante } from './entities/participante.entity';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { S3Service } from '../services/s3/s3.service';

export const geraNumAleatorio = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const participanteTeste = new CreateParticipanteDto();
participanteTeste.nome = 'Participante TESTE';
participanteTeste.email = 'emailteste@teste.com';
participanteTeste.status = 1;
participanteTeste.quantidadeON = 999;
participanteTeste.quantidadePN = 0;
participanteTeste.cpfcnpj = geraNumAleatorio(0, 10000).toString();
participanteTeste.quantidadeCotas = 0;
participanteTeste.tipoParticipante = TIPO_PARTICIPANTE.Acionista;
participanteTeste.permissaoParticipante = PERMISSAO.Usuario;
participanteTeste.participacao = PARTICIPACAO.Online;
participanteTeste.podeVotar = true;
participanteTeste.hash = null;
participanteTeste.hashedRT = null;
participanteTeste.password = null;

export const outorganteTeste = new CreateParticipanteDto();
outorganteTeste.nome = 'outorgante TESTE';
outorganteTeste.email = 'emailoutorganteteste@teste.com';
outorganteTeste.status = 1;
outorganteTeste.quantidadeON = 555;
outorganteTeste.quantidadePN = 0;
outorganteTeste.quantidadeCotas = 0;
outorganteTeste.cpfcnpj = null;
outorganteTeste.tipoParticipante = TIPO_PARTICIPANTE.Outorgante;
outorganteTeste.permissaoParticipante = PERMISSAO.Usuario;
outorganteTeste.participacao = PARTICIPACAO.Online;
outorganteTeste.podeVotar = true;
outorganteTeste.hash = null;
outorganteTeste.hashedRT = null;
outorganteTeste.password = null;

describe('ParticipantesService', () => {
  let service: ParticipanteService;

  let id = '';
  let idOutorg = '';

  beforeAll(async () => {
    process.env.DATABASE_URL =
      'mongodb+srv://tenmeetings:4QTSPDIUm2qrh5wE@tenmeetings.ytkqd.mongodb.net/TenMeetingsTEST?retryWrites=true&w=majority';
  });
  //
  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [ParticipanteService],
    // }).compile();

    // service = module.get<ParticipanteService>(ParticipanteService);
    service = new ParticipanteService(new PrismaService(new S3Service()));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Deveria salvar um participante', async () => {
    const respostaCriacao = await service.create({
      ...participanteTeste,
    });
    id = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...participanteTeste,
      }),
    );
  });
  it('Deveria ler um participante', async () => {
    await expect(service.findOne(id)).resolves.toEqual({
      ...participanteTeste,
      id,
      assembleiaId: null,
      bvdId: null,
      representanteId: null,
    });
  });

  it('Deveria alterar um participante para representante', async () => {
    await expect(
      service.update(id, {
        ...participanteTeste,
        nome: 'Fulano representante',
        tipoParticipante: TIPO_PARTICIPANTE.Representante,
      }),
    ).resolves.toEqual({
      ...participanteTeste,
      id,
      nome: 'Fulano representante',
      tipoParticipante: TIPO_PARTICIPANTE.Representante,
      assembleiaId: null,
      bvdId: null,
      representanteId: null,
    });
  });

  it('Deveria alterar um representante para participante', async () => {
    await expect(
      service.update(id, {
        ...participanteTeste,
        nome: 'Participante TESTE',
        tipoParticipante: TIPO_PARTICIPANTE.Acionista,
      }),
    ).resolves.toEqual({
      ...participanteTeste,
      id,
      nome: 'Participante TESTE',
      tipoParticipante: TIPO_PARTICIPANTE.Acionista,
      assembleiaId: null,
      bvdId: null,
      representanteId: null,
    });
  });

  it('Deveria salvar um outorgante', async () => {
    const respostaCriacaoOutorgante = await service.create({
      ...outorganteTeste,
    });
    idOutorg = respostaCriacaoOutorgante.id;
    await expect(respostaCriacaoOutorgante).toEqual(
      expect.objectContaining({
        ...outorganteTeste,
      }),
    );
  });
  it('Deveria ler um outorgante', async () => {
    await expect(service.findOne(idOutorg)).resolves.toEqual({
      ...outorganteTeste,
      id: idOutorg,
      assembleiaId: null,
      bvdId: null,
      representanteId: null,
    });
  });
  it('Deveria ler um participante', async () => {
    await expect(service.findOne(id)).resolves.toEqual({
      ...participanteTeste,
      id,
      assembleiaId: null,
      bvdId: null,
      representanteId: null,
    });
  });
  it('Deveria ler um participante com base no CPF', async () => {
    const resposta = await service.buscarPorCPFCNPJ(participanteTeste.cpfcnpj);
    await expect(resposta).toEqual({
      ...participanteTeste,
      id,
      assembleiaId: null,
      bvdId: null,
      representanteId: null,
    });
  });
  it('Deveria deletar um participante', async () => {
    await expect(service.remove(id)).resolves.toBeDefined();
  });
  it('Deveria deletar um outorgante', async () => {
    await expect(service.remove(idOutorg)).resolves.toBeDefined();
  });
});
