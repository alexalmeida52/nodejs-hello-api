import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { SqsService } from '../infra/sqs/sqs.service';

const mockSqsService = {
  sendJsonMessage: jest.fn(),
  receiveMessages: jest.fn(() => Promise.resolve(["message1", "message2"])),
  deleteMessage: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: SqsService, useValue: mockSqsService}
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return an array of users', () => {
    const users = service.findAll();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  it('findOne should return a user by ID', () => {
    const user = service.findOne(1);

    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
  });

  it('create should add a new user', async () => {
    const newUser = await service.create('John', 'john@gmail.com');
    expect(newUser).toBeDefined();
    expect(newUser.id).toBeDefined();
    expect(newUser.name).toBe('John');
    expect(newUser.email).toBe('john@gmail.com');
    const users = service.findAll();
    expect(users.length).toBe(3);
  });

  it('remove should delete a user by ID', () => {
    service.remove(1);
    const users = service.findAll();
    expect(users.length).toBe(1);
    expect(users.find((u) => u.id === 1)).toBeUndefined();
  });

  it('update should modify an existing user', () => {
    const updatedUser = service.update(2, 'Jane Doe', 'jane@gmail.com');
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe('Jane Doe');
    expect(updatedUser?.email).toBe('jane@gmail.com');
    const user = service.findOne(2);
    expect(user?.name).toBe('Jane Doe');
    expect(user?.email).toBe('jane@gmail.com');
  });
});
