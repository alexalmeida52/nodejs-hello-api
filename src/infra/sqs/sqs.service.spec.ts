import { Test, TestingModule } from '@nestjs/testing';
import { SqsService } from './sqs.service';
import { ConfigService } from '@nestjs/config';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand } from '@aws-sdk/client-sqs';

const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'test-key',
      AWS_SECRET_ACCESS_KEY: 'test-secret',
      AWS_ENDPOINT_URL: 'http://localhost:4566/',
      AWS_SQS_QUEUE_NAME: 'queue',
    };
    return config[key];
  }),
};

const mockSqsClient = {
  send: jest.fn(),
  config: { endpoint: 'http://localhost:4566/' },
};

describe('SqsService', () => {
  let service: SqsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqsService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SqsService>(SqsService);
    // @ts-ignore
    service.sqsClient = mockSqsClient;
    // @ts-ignore
    service.queueReceiveUrl = 'http://localhost:4566/queue';
    // @ts-ignore
    service.awsEnpoint = 'http://localhost:4566/';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('receiveMessages deve retornar mensagens', async () => {
    mockSqsClient.send.mockResolvedValueOnce({ Messages: [{ messageId: '1', body: 'test' }] });
    const messages = await service.receiveMessages();
    expect(messages).toEqual([{ messageId: '1', body: 'test' }]);
  });

  it('deleteMessage deve chamar send com DeleteMessageCommand', async () => {
    mockSqsClient.send.mockResolvedValueOnce({});
    await service.deleteMessage('receipt-handle');
    expect(mockSqsClient.send).toHaveBeenCalledWith(expect.any(DeleteMessageCommand));
  });

  it('sendJsonMessage deve chamar sendMessage e retornar MessageId', async () => {
    mockSqsClient.send.mockResolvedValueOnce({ MessageId: 'abc123' });
    const result = await service.sendJsonMessage('queue', { foo: 'bar' });
    expect(result).toBe('abc123');
    expect(mockSqsClient.send).toHaveBeenCalledWith(expect.any(SendMessageCommand));
  });
});
