import { Test, TestingModule } from '@nestjs/testing';
import { SupportRequestsController } from './support-requests.controller';
import { SupportRequestsService } from './support-requests.service';

describe('SupportRequestsController', () => {
  let controller: SupportRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportRequestsController],
      providers: [SupportRequestsService],
    }).compile();

    controller = module.get<SupportRequestsController>(
      SupportRequestsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
