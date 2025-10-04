import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SqsModule } from 'src/infra/sqs/sqs.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SqsModule]
})
export class UsersModule {}
