import { Injectable, Logger } from '@nestjs/common';
import { CreateBvdDto } from './dto/create-bvd.dto';
import { UpdateBvdDto } from './dto/update-bvd.dto';
import { Assembleia } from '../assembleia/entities/assembleia.entity';
import { Participante } from '../participante/entities/participante.entity';
import { Voto } from '../voto/entities/voto.entity';
import { Pauta } from '../pauta/entities/pauta.entity';
import { Escolha } from '../escolha/entities/escolha.entity';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateParticipanteDto } from '../participante/dto/create-participante.dto';
import { CreateVotoDto } from '../voto/dto/create-voto.dto';
import { ParticipanteService } from '../participante/participante.service';
import { VotoService } from '../voto/voto.service';

@Injectable()
export class BvdService {
  constructor(
    private prisma: PrismaService,
    private participanteService: ParticipanteService,
    private votoService: VotoService,
  ) {}

  create(createBvdDto: CreateBvdDto) {
    return this.prisma.bvd.create({ data: createBvdDto });
  }

  async findAll() {
    return await this.prisma.bvd.findMany();
  }
  uploadBVD(assembleia: Assembleia, participante: Participante, votos: Voto[]) {
    return;
  }

  async findOne(id: string) {
    return await this.prisma.bvd.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateBvdDto: UpdateBvdDto) {
    return await this.prisma.bvd.update({
      where: { id },
      data: updateBvdDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.bvd.delete({ where: { id } });
  }

  async parse(planilha: any[], assId: string) {
    const assembleia = await this.prisma.assembleia.findUnique({
      where: { id: assId },
    });

    if (planilha.length >= 1) {
      let linhaCabecalhos = 0;
      let colunaCPFCNPJ = 0;

      // Define a linha de cabeçalhos
      for (let indexLinha = 0; indexLinha < planilha.length; indexLinha++) {
        for (
          let indexColuna = 0;
          indexColuna < planilha[indexLinha].length;
          indexColuna++
        ) {
          const celula = planilha[indexLinha][indexColuna].toLowerCase();
          if (celula.includes('cpf') && celula.includes('cnpj')) {
            linhaCabecalhos = indexLinha;
            colunaCPFCNPJ = indexColuna;
            break;
          }
        }
      }

      let colunaNome = 0;
      let colunaQuantidadeAcoesVoto = 0;
      let colunaPauta = 0;
      let colunaEscolha = 0;

      // Define as colunas dos campos
      for (
        let indexColuna = 0;
        indexColuna < planilha[linhaCabecalhos].length;
        indexColuna++
      ) {
        const celula = planilha[linhaCabecalhos][indexColuna].toLowerCase();
        if (celula.includes('nome') && celula.includes('investidor')) {
          colunaNome = indexColuna;
        }
        if (celula.includes('eo')) {
          colunaQuantidadeAcoesVoto = indexColuna;
        }
        if (celula.includes('digo da delibera')) {
          colunaPauta = indexColuna;
        }
        if (celula.includes('voto delibera')) {
          colunaEscolha = indexColuna;
        }
      }
      const participantes: {
        participante: CreateParticipanteDto;
        votos: CreateVotoDto[];
      }[] = [];
      const pautas: Pauta[] = [];
      const participanteEVoto = {
        participante: new CreateParticipanteDto(),
        votos: [],
      };
      for (
        let indexLinha = linhaCabecalhos + 1;
        indexLinha < planilha.length;
        indexLinha++
      ) {
        const linhaAtual = planilha[indexLinha];

        let participanteAtual = participanteEVoto.participante;
        participanteAtual.cpfcnpj = linhaAtual[colunaCPFCNPJ];
        participanteAtual.quantidadeON = Number(
          linhaAtual[colunaQuantidadeAcoesVoto],
        );
        participanteAtual.nome = linhaAtual[colunaNome];

        if (
          participantes.filter(
            (part) => part.participante.cpfcnpj === participanteAtual.cpfcnpj,
          ).length > 0
        ) {
          participanteAtual = participantes.find(
            () =>
              participantes.filter(
                (part) =>
                  part.participante.cpfcnpj === participanteAtual.cpfcnpj,
              )[0],
          ).participante;
        } else {
          participantes.push({ participante: participanteAtual, votos: [] });
        }

        let pautaAtual = new Pauta();
        const ordem = Number(linhaAtual[colunaPauta]);

        if (pautas[ordem]) {
          pautaAtual = pautas[ordem];
        } else {
          pautaAtual = await this.prisma.pauta.findFirst({
            where: { assembleiaId: assId, ordem },
            include: { escolhas: true },
          });
          pautas[ordem] = pautaAtual;
        }

        let escolhas: Escolha[] = [];

        if (pautaAtual.escolhas) {
          escolhas = pautaAtual.escolhas;
        }

        const votoAtual = new Voto();
        votoAtual.quantidadeVotos = participanteAtual.quantidadeON;

        escolhas.forEach((escolha) => {
          if (
            escolha.opcao.toLowerCase() ===
            linhaAtual[colunaEscolha].toLowerCase()
          ) {
            votoAtual.escolhaId = escolha.id;
          }
        });
        participanteEVoto.votos.push(votoAtual);
      }

      const participanteExiste =
        await this.participanteService.buscarPorCPFCNPJ(
          participanteEVoto.participante.cpfcnpj,
        );

      if (participanteExiste) {
        await this.votoService.votarVarios([
          ...participanteEVoto.votos.map((voto) => {
            return {
              ...voto,
              participanteId: participanteExiste.id,
            };
          }),
        ]);
      } else {
        await this.participanteService.create({
          ...participanteEVoto.participante,
          assembleia: { connect: { id: assembleia.id } },
          votos: { create: participanteEVoto.votos },
        });
      }
    }
  }
}
