import { Test, TestingModule } from '@nestjs/testing';
import { AdjudicationService } from './adjudication.service';

describe('AdjudicationService', () => {
  let service: AdjudicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdjudicationService],
    }).compile();

    service = module.get<AdjudicationService>(AdjudicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
