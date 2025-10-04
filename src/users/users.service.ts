import { Injectable } from '@nestjs/common';
import { User } from './dtos/user.response.dto';
import { SqsService } from '../infra/sqs/sqs.service';

@Injectable()
export class UsersService {
  private readonly QUEUE_NAME = '/000000000000/user';
  constructor(private readonly sqsService: SqsService) {}

  private users: User[] = [
    new User(1, 'Alex', 'alex@example.com'),
    new User(2, 'Maria', 'maria@example.com'),
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  async create(name: string, email: string): Promise<User> {
    const newUser = new User(
      this.users.length ? this.users[this.users.length - 1].id + 1 : 1,
      name,
      email,
    );
    this.users.push(newUser);
    await this.sqsService.sendJsonMessage(this.QUEUE_NAME, {
      action: 'USER_CREATED',
      user: newUser,
    });
    return newUser;
  }

  update(id: number, name: string, email: string): User | null {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex].name = name;
    this.users[userIndex].email = email;
    return this.users[userIndex];
  }

  remove(id: number): User | null {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return null;

    const [removed] = this.users.splice(userIndex, 1);
    return removed;
  }
}
