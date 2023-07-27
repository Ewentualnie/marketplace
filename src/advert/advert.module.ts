import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';

@Module({
  controllers: [AdvertController],
  providers: [AdvertService]
})
export class AdvertModule {}
