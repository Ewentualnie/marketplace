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
import { GetCurrentUser } from 'src/utils/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('adverts')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @Post('')
  create(
    @Body() createAdvertDto: CreateAdvertDto,
    @GetCurrentUser() user: User,
  ) {
    return this.advertService.create(createAdvertDto, user);
  }

  @Public()
  @Get()
  findAll(@Query() query: any) {
    return this.advertService.findAllowedAdverts(query);
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
    @GetCurrentUser() user: User,
  ) {
    return this.advertService.update(id, updateAdvertDto, user);
  }

  @Delete()
  remove(@GetCurrentUser() user: User) {
    return this.advertService.removeOwnAdvert(user);
  }
}
