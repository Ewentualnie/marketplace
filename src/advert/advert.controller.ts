import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from '../models/dto/create-advert.dto';
import { UpdateAdvertDto } from '../models/dto/update-advert.dto';
import { Public } from 'src/utils/decorators/public.decorator';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Adverts')
@Controller('adverts')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('image'))
  create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    files: Express.Multer.File,
    @Body() createAdvertDto: CreateAdvertDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.advertService.create(createAdvertDto, userId, files[0]);
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
  @UseInterceptors(FilesInterceptor('image'))
  update(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    files: Express.Multer.File,
    @Param('id', ParseIntPipe) advertId: number,
    @Body() updateAdvertDto: UpdateAdvertDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.advertService.updateAdvertInfo(
      advertId,
      updateAdvertDto,
      userId,
      files[0],
    );
  }

  @Delete()
  remove(@GetCurrentUserId() userId: number) {
    return this.advertService.removeOwnAdvert(userId);
  }
}
