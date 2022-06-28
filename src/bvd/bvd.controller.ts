import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BvdService } from './bvd.service';
import { CreateBvdDto } from './dto/create-bvd.dto';
import { UpdateBvdDto } from './dto/update-bvd.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvParser } from 'nest-csv-parser';
import * as fs from 'fs';
import { parse } from 'csv-parse';

class Entity {
  bar: string;
}
@Controller('bvd')
export class BvdController {
  constructor(private readonly bvdService: BvdService) {}

  @Post()
  create(@Body() createBvdDto: CreateBvdDto) {
    return this.bvdService.create(createBvdDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', { dest: './bvd_files', preservePath: true }),
  )
  async uploadBvd(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    // console.log(file);
    const results = [];

    fs.createReadStream(`./bvd_files/${file.filename}`)
      .pipe(parse({ delimiter: ';' }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        const { assembleiaId } = body;
        this.bvdService.parse(results, assembleiaId);
      });

    // .pipe(csv({ separator: ';', skipComments: false, strict: true }))
    // .on('data', (data) => results.push(data))
    // .on('end', () => {
    //   console.log(results);
    // });
    // const entities: Entity[] = ;
    // console.log(results);
  }

  @Get()
  findAll() {
    return this.bvdService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bvdService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBvdDto: UpdateBvdDto) {
    return this.bvdService.update(id, updateBvdDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bvdService.remove(id);
  }
}
