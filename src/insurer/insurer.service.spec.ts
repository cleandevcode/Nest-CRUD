import { Test, TestingModule } from '@nestjs/testing';
import { InsurerService } from './insurer.service';

describe('InsurerService', () => {
  let service: InsurerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsurerService],
    }).compile();

    service = module.get<InsurerService>(InsurerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
