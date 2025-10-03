import { Injectable } from '@nestjs/common';
import { User } from './dtos/user.response.dto';

@Injectable()
export class UsersService {
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

  create(name: string, email: string): User {
    const newUser = new User(
      this.users.length ? this.users[this.users.length - 1].id + 1 : 1,
      name,
      email,
    );
    this.users.push(newUser);
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
