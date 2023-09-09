import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Headers,
  Query,
} from '@nestjs/common';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller('adverts')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @Post('')
  create(
    @Body() createAdvertDto: CreateAdvertDto,
    @Headers('authorization') accesToken: string,
  ) {
    return this.advertService.create(createAdvertDto, accesToken);
  }

  @Public()
  @Get()
  findAll(@Query() query: any) {
    return this.advertService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.advertService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdvertDto: UpdateAdvertDto,
    @Headers('authorization') accessToken: string,
  ) {
    return this.advertService.update(id, updateAdvertDto, accessToken);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Headers('authorization') accessToken: string,
  ) {
    return this.advertService.remove(id, accessToken);
  }
}
