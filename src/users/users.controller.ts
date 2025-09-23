import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    const user = this.usersService.findOne(Number(id));
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  @Post()
  create(@Body() body: { name: string; email: string }): User {
    return this.usersService.create(body.name, body.email);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { name: string; email: string }): User {
    const updated = this.usersService.update(Number(id), body.name, body.email);
    if (!updated) throw new NotFoundException('Usuário não encontrado');
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string): User {
    const deleted = this.usersService.remove(Number(id));
    if (!deleted) throw new NotFoundException('Usuário não encontrado');
    return deleted;
  }
}
