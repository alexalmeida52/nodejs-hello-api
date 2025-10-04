import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SqsModule } from './infra/sqs/sqs.module';
import { SqsConsumerService } from './infra/sqs-consumer-service/sqs-consumer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      ignoreEnvFile: false,
      envFilePath: '.env',
    }),
    UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
