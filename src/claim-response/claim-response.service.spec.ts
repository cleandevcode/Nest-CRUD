import { Test, TestingModule } from '@nestjs/testing';
import { ClaimResponseService } from './claim-response.service';

describe('ClaimResponseService', () => {
  let service: ClaimResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaimResponseService],
    }).compile();

    service = module.get<ClaimResponseService>(ClaimResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
