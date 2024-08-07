import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from '../models/dto/create-advert.dto';
import { UpdateAdvertDto } from '../models/dto/update-advert.dto';
import { Public } from 'src/utils/decorators/public.decorator';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DateValidationPipe } from 'src/utils/validators/date_validator';

@ApiTags('Adverts')
@Controller('adverts')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createAdvertDto: CreateAdvertDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.advertService.create(createAdvertDto, userId, file);
  }

  @Public()
  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.advertService.findAllowedAdverts(query);
  }

  @Public()
  @Get(':id/timeslots')
  getTimeslots(
    @Param('id', ParseIntPipe) id: number,
    @Query('from', DateValidationPipe) from?: Date,
    @Query('to', DateValidationPipe) to?: Date,
  ) {
    return this.advertService.getTimeslots(id, from, to);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.advertService.findOne(id);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @Param('id', ParseIntPipe) advertId: number,
    @GetCurrentUserId() userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.advertService.updateAdvertImage(advertId, userId, file);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) advertId: number,
    @Body() updateAdvertDto: UpdateAdvertDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.advertService.updateAdvertInfo(
      advertId,
      updateAdvertDto,
      userId,
    );
  }

  @Put()
  remove(@GetCurrentUserId() userId: number) {
    return this.advertService.deleteRestoreAdvert(userId);
  }

  @Put(':id/favorite')
  addtoFavorite(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) advertId: number,
  ) {
    return this.advertService.toFavorite(userId, advertId);
  }
}
