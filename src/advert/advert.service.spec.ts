import { Test, TestingModule } from '@nestjs/testing';
import { AdvertService } from './advert.service';

describe('AdvertService', () => {
  let service: AdvertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertService],
    }).compile();

    service = module.get<AdvertService>(AdvertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
