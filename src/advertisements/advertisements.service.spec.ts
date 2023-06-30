import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisementsService } from './advertisements.service';

describe('AdvertisementsService', () => {
  let service: AdvertisementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertisementsService],
    }).compile();

    service = module.get<AdvertisementsService>(AdvertisementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
