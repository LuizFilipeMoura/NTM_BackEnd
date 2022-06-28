import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PautaService } from './pauta.service';
import { CreatePautaDto } from './dto/create-pauta.dto';
import { UpdatePautaDto } from './dto/update-pauta.dto';

@Controller('pauta')
export class PautaController {
  constructor(private readonly pautaService: PautaService) {}

  @Post()
  create(@Body() createPautaDto: CreatePautaDto) {
    return this.pautaService.cadastrarPauta(createPautaDto);
  }

  @Get()
  findAll() {
    return this.pautaService.findAll();
  }

  @Get('escolhas/:id')
  buscaEscolhas(@Param('id') idPauta: string) {
    return this.pautaService.buscaEscolhas(idPauta);
  }

  @Get('tabular/:id')
  tabulaPauta(@Param('id') idPauta: string) {
    return this.pautaService.tabulaPauta(idPauta);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pautaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePautaDto: UpdatePautaDto,
  ) {
    delete updatePautaDto.id;
    delete updatePautaDto['escolhas'];
    return await this.pautaService.update(id, updatePautaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pautaService.remove(id);
  }
}
