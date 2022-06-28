import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssembleiaService } from './assembleia.service';
import { CreateAssembleiaDto } from './dto/create-assembleia.dto';
import { UpdateAssembleiaDto } from './dto/update-assembleia.dto';

@Controller('assembleia')
export class AssembleiaController {
  constructor(private assembleiaService: AssembleiaService) {}

  @Post()
  create(@Body() createAssembleiaDto: CreateAssembleiaDto) {
    return this.assembleiaService.create(createAssembleiaDto);
  }

  @Get()
  async findAll() {
    return await this.assembleiaService.findAll();
  }

  @Get('pautas/:id')
  async findPautas(@Param('id') id: string) {
    return await this.assembleiaService.findPautas(id);
  }

  @Get('participantes/:id')
  async findParticipantes(@Param('id') id: string) {
    return await this.assembleiaService.findParticipantes(id);
  }
  @Get('representante/:id')
  async findRepresentantes(@Param('id') id: string) {
    return await this.assembleiaService.findRepresentantes(id);
  }
  @Get('representante/:id/:representanteid')
  async findOutorgantes(
    @Param('id') id: string,
    @Param('representanteid') representanteid: string,
  ) {
    return await this.assembleiaService.findOutorgantes(id, representanteid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assembleiaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssembleiaDto: UpdateAssembleiaDto,
  ) {
    delete updateAssembleiaDto.id;
    return await this.assembleiaService.update(id, updateAssembleiaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.assembleiaService.remove(id);
  }
}
