import { Test, TestingModule } from '@nestjs/testing';
import { ClaimResponseController } from './claim-response.controller';

describe('ClaimResponseController', () => {
  let controller: ClaimResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimResponseController],
    }).compile();

    controller = module.get<ClaimResponseController>(ClaimResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
