import { Module } from '@nestjs/common';
import { PautaService } from './pauta.service';
import { PautaController } from './pauta.controller';
import { EscolhaService } from '../escolha/escolha.service';

@Module({
  imports: [EscolhaService],
  controllers: [PautaController],
  providers: [EscolhaService, PautaService],
})
export class PautaModule {}
