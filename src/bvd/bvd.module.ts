import { Module } from '@nestjs/common';
import { BvdService } from './bvd.service';
import { BvdController } from './bvd.controller';
import { CsvModule } from 'nest-csv-parser';
import { ParticipanteService } from '../participante/participante.service';
import { VotoService } from '../voto/voto.service';

@Module({
  imports: [CsvModule],
  controllers: [BvdController],
  providers: [BvdService, ParticipanteService, VotoService],
})
export class BvdModule {}
