import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EscolhaService } from './escolha.service';
import { CreateEscolhaDto } from './dto/create-escolha.dto';
import { UpdateEscolhaDto } from './dto/update-escolha.dto';

@Controller('escolha')
export class EscolhaController {
  constructor(private readonly escolhaService: EscolhaService) {}

  @Post()
  create(@Body() createEscolhaDto: CreateEscolhaDto) {
    return this.escolhaService.create(createEscolhaDto);
  }

  @Get()
  findAll() {
    return this.escolhaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.escolhaService.findOne(id);
  }
  @Get('votos/:id')
  buscaVotos(@Param('id') idEscolha: string) {
    return this.escolhaService.buscaVotos(idEscolha);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEscolhaDto: UpdateEscolhaDto) {
    delete updateEscolhaDto.id;
    return this.escolhaService.update(id, updateEscolhaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.escolhaService.remove(id);
  }
}
