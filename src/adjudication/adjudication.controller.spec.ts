import { Test, TestingModule } from '@nestjs/testing';
import { AdjudicationController } from './adjudication.controller';

describe('AdjudicationController', () => {
  let controller: AdjudicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdjudicationController],
    }).compile();

    controller = module.get<AdjudicationController>(AdjudicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
