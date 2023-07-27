import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';

@Controller('advert')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @Post()
  create(@Body() createAdvertDto: CreateAdvertDto) {
    return this.advertService.create(createAdvertDto);
  }

  @Get()
  findAll() {
    return this.advertService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.advertService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdvertDto: UpdateAdvertDto,
  ) {
    return this.advertService.update(id, updateAdvertDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.advertService.remove(id);
  }
}
