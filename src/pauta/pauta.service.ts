import { Injectable } from '@nestjs/common';
import { CreatePautaDto } from './dto/create-pauta.dto';
import { UpdatePautaDto } from './dto/update-pauta.dto';
import { Pauta } from './entities/pauta.entity';
import { EscolhaService } from '../escolha/escolha.service';
import { Escolha } from '../escolha/entities/escolha.entity';
import { PrismaService } from '../services/prisma/prisma.service';
import { create } from 'domain';
import { TIPO_PAUTA } from '../shared/enums/pautaEnums';
import { UpdateEscolhaDto } from '../escolha/dto/update-escolha.dto';

@Injectable()
export class PautaService {
  constructor(
    private escolhaService: EscolhaService,
    private prisma: PrismaService,
  ) {}

  /**
   * @deprecated usar apenas para DEBUG
   */
  create(createPautaDto: CreatePautaDto): Promise<Pauta> {
    return this.prisma.pauta.create({ data: createPautaDto });
  }

  async buscaEscolhas(pautaId: string) {
    return await this.prisma.escolha.findMany({ where: { pautaId } });
  }

  async findAll() {
    return await this.prisma.pauta.findMany();
  }

  findOne(id: string) {
    return this.prisma.pauta.findUnique({ where: { id } });
  }
  findEscolhas(pautaId: string) {
    return this.prisma.escolha.findMany({ where: { pautaId } });
  }
  async cadastrarPauta(pauta: CreatePautaDto) {
    let escolhas;
    if (pauta.tipoVoto === TIPO_PAUTA.APROVAR_REJEITAR_ABSTER) {
      console.log('ENTROU IF');
      const escolha1 = new Escolha();
      escolha1.ordem = 1;
      escolha1.opcao = 'Aprovar';
      const escolha2 = new Escolha();
      escolha2.ordem = 2;
      escolha2.opcao = 'Rejeitar';
      const escolha3 = new Escolha();
      escolha3.ordem = 3;
      escolha3.opcao = 'Abster-se';
      escolhas = [escolha1, escolha2, escolha3];
    }
    pauta = await this.prisma.pauta.create({
      data: { ...pauta, escolhas: { create: escolhas } },
    });
    return pauta;
  }

  async update(id: string, updatePautaDto: UpdatePautaDto) {
    return await this.prisma.pauta.update({
      where: { id },
      data: updatePautaDto,
    });
  }

  async removeEscolhas(idPauta: string) {
    const escolhas = await this.findEscolhas(idPauta);
    const promesas = escolhas.map((escolha) =>
      this.escolhaService.remove(escolha.id),
    );

    return await Promise.all(promesas);
  }
  async remove(id: string) {
    const r = await this.removeEscolhas(id);
    console.log(r);
    return await this.prisma.pauta.delete({ where: { id } });
  }

  async tabulaPauta(pautaId: string) {
    const pauta = await this.prisma.pauta.findUnique({
      where: { id: pautaId },
      include: { votos: true, escolhas: true },
    });

    pauta.escolhas = pauta.escolhas.map((escolha) => {
      escolha.totalDeVotos = 0;
      pauta.votos.map((voto) => {
        if (voto.escolhaId === escolha.id) {
          escolha.totalDeVotos += voto.quantidadeVotos;
        }
      });
      return escolha;
    });
    pauta.escolhas.map((escolha) => {
      const id = escolha.id;
      this.escolhaService.update(escolha.id, escolha);
    });
    console.log(pauta);
  }
}
