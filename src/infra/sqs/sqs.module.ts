import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { ConfigModule } from '@nestjs/config';
import { SqsConsumerService } from '../sqs-consumer-service/sqs-consumer.service';

@Module({
  imports: [ConfigModule],
  providers: [SqsService, SqsConsumerService],
  exports: [SqsService]
})
export class SqsModule {}
