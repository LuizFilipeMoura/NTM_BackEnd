import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VotoService } from './voto.service';
import { CreateVotoDto } from './dto/create-voto.dto';
import { UpdateVotoDto } from './dto/update-voto.dto';

export class VotoPayload {
  escolhaId: string;
  participanteId: string;
  pautaId: string;
}
@Controller('voto')
export class VotoController {
  constructor(private readonly votoService: VotoService) {}

  @Post()
  create(@Body() payload: VotoPayload) {
    return this.votoService.votarUnico(payload);
  }

  @Get()
  findAll() {
    return this.votoService.findAll();
  }
  @Get('porParticipante/:id')
  getVotosPorParticipante(@Param('id') participanteId: string) {
    return this.votoService.getVotosParticipante(participanteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.votoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVotoDto: UpdateVotoDto) {
    delete updateVotoDto.id;
    return this.votoService.update(id, updateVotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.votoService.remove(id);
  }
}
