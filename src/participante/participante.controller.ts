import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';

@Controller('participante')
export class ParticipanteController {
  constructor(private readonly participantesService: ParticipanteService) {}

  @Post()
  create(@Body() createParticipanteDto: CreateParticipanteDto) {
    return this.participantesService.create(createParticipanteDto);
  }

  @Get()
  findAll() {
    return this.participantesService.findAll();
  }

  @Get('/outs/:id')
  findOutorgantes(@Param('id') id: string) {
    return this.participantesService.findManyOutorgantes(id);
  }
  @Get('/rep/')
  findRepresentantes() {
    return this.participantesService.findManyRepresentantes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateParticipanteDto: UpdateParticipanteDto,
  ) {
    delete updateParticipanteDto.id;
    return this.participantesService.update(id, updateParticipanteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.participantesService.remove(id);
  }
}
