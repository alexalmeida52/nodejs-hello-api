import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SqsService } from '../sqs/sqs.service';

@Injectable()
export class SqsConsumerService implements OnModuleInit {
  private readonly logger = new Logger(SqsConsumerService.name);
  private isPolling = false;

  constructor(private readonly sqsService: SqsService) {}

  onModuleInit() {
    this.startPolling();
  }

  private async startPolling() {
    if (this.isPolling) return;

    this.isPolling = true;
    this.logger.log('Starting SQS polling...');

    while (this.isPolling) {
      try {
        await this.pollMessages();
      } catch (error) {
        this.logger.error('Error in polling cycle:', error);
        this.isPolling = false;
      }
    }
  }

  private async pollMessages() {
    const messages = await this.sqsService.receiveMessages();

    if (messages.length > 0) {
      this.logger.log(`Received ${messages.length} messages`);

      await Promise.all(
        messages.map(async (message) => {
          try {
            await this.processMessage(message);
            if (!message.ReceiptHandle) {
                throw new Error('Missing ReceiptHandle in message');
            }
            await this.sqsService.deleteMessage(message.ReceiptHandle);
          } catch (error) {
            this.logger.error(`Error processing message ${message.MessageId}:`, error);
          }
        })
      );
    }
  }

  private async processMessage(message: any) {
    try {
      this.logger.log('Processing message:', message.MessageId);
      
      const body = JSON.parse(message.Body);
      
      this.logger.log('Message body:', body);

    } catch (error) {
      this.logger.error('Error processing message body:', error);
      throw error;
    }
  }

  stopPolling() {
    this.isPolling = false;
    this.logger.log('SQS polling stopped');
  }
}