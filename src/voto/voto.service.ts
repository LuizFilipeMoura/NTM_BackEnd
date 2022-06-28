import { Injectable } from '@nestjs/common';

import { PrismaService } from '../services/prisma/prisma.service';
import { UpdateVotoDto } from './dto/update-voto.dto';
import { Participante } from '../participante/entities/participante.entity';
import { CreateVotoDto } from './dto/create-voto.dto';
import { Voto } from './entities/voto.entity';
import { Pauta } from '../pauta/entities/pauta.entity';
import { TIPO_VOTANTE } from '../shared/enums/pautaEnums';
import { VotoPayload } from './voto.controller';

@Injectable()
export class VotoService {
  constructor(private prisma: PrismaService) {}

  create(createVotoDto: CreateVotoDto) {
    return this.prisma.voto.create({ data: createVotoDto });
  }

  async votarUnico(payload: VotoPayload) {
    const voto = new CreateVotoDto();
    const participante = (await this.prisma.participante.findUnique({
      where: { id: payload.participanteId },
    })) as Participante;
    const pauta = (await this.prisma.pauta.findUnique({
      where: { id: payload.pautaId },
    })) as Pauta;

    voto.quantidadeVotos = this.calcularQuantidadeVotos(pauta, participante);
    voto.participante = { connect: { id: payload.participanteId } };
    voto.pauta = { connect: { id: payload.pautaId } };
    voto.escolha = { connect: { id: payload.escolhaId } };

    const participanteJaVotouNessaPauta =
      await this.verificaSeParticipanteVotouPauta(pauta.id, participante.id);
    console.log(participanteJaVotouNessaPauta);

    if (!participanteJaVotouNessaPauta) {
      return await this.prisma.voto.create({
        data: voto,
      });
    }
    return await this.prisma.voto.update({
      where: { id: participanteJaVotouNessaPauta.id },
      data: voto,
    });
  }
  async votarVarios(votos: Voto[]) {
    return await this.prisma.voto.createMany({
      data: [...votos],
    });
  }

  async findAll() {
    return await this.prisma.voto.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.voto.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateVotoDto: UpdateVotoDto) {
    return await this.prisma.voto.update({
      where: { id },
      data: updateVotoDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.voto.delete({ where: { id } });
  }

  calcularQuantidadeVotos(pauta: Pauta, participante: Participante) {
    let quantidadeFinal = 0;
    if ([TIPO_VOTANTE.PN, TIPO_VOTANTE.ON_PN].includes(pauta.tipoAcaoVotante)) {
      quantidadeFinal += participante.quantidadePN || 0;
    }
    if ([TIPO_VOTANTE.ON, TIPO_VOTANTE.ON_PN].includes(pauta.tipoAcaoVotante)) {
      quantidadeFinal += participante.quantidadeON || 0;
    }
    if ([TIPO_VOTANTE.COTAS].includes(pauta.tipoAcaoVotante)) {
      quantidadeFinal += participante.quantidadeCotas || 0;
    }
    if ([TIPO_VOTANTE.POR_CABECA].includes(pauta.tipoAcaoVotante)) {
      quantidadeFinal += 1;
    }
    return quantidadeFinal;
  }

  private verificaSeParticipanteVotouPauta(
    pautaId: string,
    participanteId: string,
  ) {
    return this.prisma.voto.findFirst({ where: { pautaId, participanteId } });
  }

  async getVotosParticipante(participanteId: string) {
    return await this.prisma.voto.findMany({
      where: { participanteId },
      orderBy: [{ pauta: { ordem: 'asc' } }],
    });
  }
}
