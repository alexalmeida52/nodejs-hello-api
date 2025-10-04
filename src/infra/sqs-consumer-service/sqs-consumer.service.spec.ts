import { Test, TestingModule } from '@nestjs/testing';
import { SqsConsumerService } from './sqs-consumer.service';
import { SqsService } from '../sqs/sqs.service';

const mockSqsService = {
  receiveMessages: jest.fn(),
  deleteMessage: jest.fn(),
};

describe('SqsConsumerService', () => {
  let service: SqsConsumerService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqsConsumerService,
        { provide: SqsService, useValue: mockSqsService },
      ],
    }).compile();

    service = module.get<SqsConsumerService>(SqsConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('pollMessages deve processar e deletar mensagens', async () => {
    const message = { MessageId: '1', Body: '{"foo":"bar"}', ReceiptHandle: 'abc' };
    mockSqsService.receiveMessages.mockResolvedValueOnce([message]);
    mockSqsService.deleteMessage.mockResolvedValueOnce(undefined);
    const spy = jest.spyOn<any, any>(service as any, 'processMessage').mockResolvedValueOnce(undefined);
    await service['pollMessages']();
    expect(spy).toHaveBeenCalledWith(message);
    expect(mockSqsService.deleteMessage).toHaveBeenCalledWith('abc');
  });

  // it('pollMessages não deve chamar deleteMessage se ReceiptHandle faltar', async () => {
  //   const message = { MessageId: '2', Body: '{"foo":"bar"}' };
  //   mockSqsService.receiveMessages.mockResolvedValueOnce([message]);
  //   const spy = jest.spyOn<any, any>(service as any, 'processMessage').mockResolvedValueOnce(undefined);
  //   await service['pollMessages']();
  //   expect(spy).toHaveBeenCalledWith(message);
  //   expect(mockSqsService.deleteMessage).not.toHaveBeenCalled();
  // });

  it('stopPolling deve alterar isPolling para false', () => {
    (service as any).isPolling = true;
    service.stopPolling();
    expect((service as any).isPolling).toBe(false);
  });
});
