import { Test, TestingModule } from '@nestjs/testing';
import { AdjudicatorService } from './adjudicator.service';

describe('ClientService', () => {
  let service: AdjudicatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdjudicatorService],
    }).compile();

    service = module.get<AdjudicatorService>(AdjudicatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
