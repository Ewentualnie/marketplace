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
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdvertService } from './advert.service';
import { CreateAdvertDto } from '../models/dto/create-advert.dto';
import { UpdateAdvertDto } from '../models/dto/update-advert.dto';
import { Public } from 'src/utils/decorators/public.decorator';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Adverts')
@ApiBearerAuth()
@Controller('adverts')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @Post('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create advert',
    type: CreateAdvertDto,
  })
  @UseInterceptors(FileInterceptor('imagePath'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body()
    createAdvertDto: CreateAdvertDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.advertService.create(createAdvertDto, userId, file);
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

  @Delete()
  remove(@GetCurrentUserId() userId: number) {
    return this.advertService.removeOwnAdvert(userId);
  }
}
