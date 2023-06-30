import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisementsController } from './advertisements.controller';
import { AdvertisementsService } from './advertisements.service';

describe('AdvertisementsController', () => {
  let controller: AdvertisementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertisementsController],
      providers: [AdvertisementsService],
    }).compile();

    controller = module.get<AdvertisementsController>(AdvertisementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
