import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

// Mock do UsersService
const mockUsersService = {
  findAll: jest.fn(() => [{ id: 1, name: 'Mock User', email: 'mock@email.com' }]),
  findOne: jest.fn((id: number):any | null => ({ id, name: 'Mock User', email: 'mock@gmail.com'})),
  create: jest.fn((name: string, email: string) => ({ id: Date.now(), name, email })),
  update: jest.fn((id: number, name: string, email: string) => ({ id, name, email })),
  remove: jest.fn((id: number): any | null => ({ id, name: 'Deleted User', email: 'delete@gmail.com'}))
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return an array of users', () => {
    const users = controller.findAll();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].name).toBe('Mock User');
  });

  it('findAll deve retornar um array vazio', () => {
    mockUsersService.findAll.mockReturnValueOnce([]);
    const users = controller.findAll();
    expect(users).toEqual([]);
  });

  it('findOne deve retornar um usuário pelo ID', () => {
    const user = controller.findOne('1');
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.name).toBe('Mock User');
  });

  it('findOne deve lançar erro ao não encontrar dados', () => {
    mockUsersService.findOne.mockImplementationOnce(() => null);  
    expect(() => controller.findOne('999')).toThrow('Usuário não encontrado');
  });

  it('create deve adicionar um novo usuário', () => {
    const newUser = controller.create({ name: 'New User', email: 'new@gmail.com' });
    expect(newUser).toBeDefined();
    expect(newUser.id).toBeDefined();
    expect(newUser.name).toBe('New User');
    expect(newUser.email).toBe('new@gmail.com');
  });

  it('update deve modificar um usuário existente', () => {
    const updatedUser = controller.update('1', { name: 'Updated User', email: 'update@gmail.com' });
    expect(updatedUser).toBeDefined();
    expect(updatedUser.id).toBe(1);
    expect(updatedUser.name).toBe('Updated User');
    expect(updatedUser.email).toBe('update@gmail.com');
  });

  it('Update deve lançar erro ao não encontrar dados', () => {
    (mockUsersService.update as jest.Mock).mockImplementationOnce(() => null);
    expect(() => controller.update('999', { name: 'Error User', email: '' })).toThrow('Usuário não encontrado');
  });

  it('remove deve deletar um usuário pelo ID', () => {
    const deletedUser = controller.remove('1');
    expect(deletedUser).toBeDefined();
    expect(deletedUser.id).toBe(1);
    expect(deletedUser.name).toBe('Deleted User');
  });

  it('remove deve lançar erro ao não encontrar dados', () => {
    mockUsersService.remove.mockImplementationOnce(() => null);
    expect(() => controller.remove('999')).toThrow('Usuário não encontrado');
  });
});
