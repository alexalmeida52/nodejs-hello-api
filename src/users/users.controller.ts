import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRequestDTO } from './dtos/UserDTO';

@ApiTags('hello')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obter todos os usuários' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários retornada com sucesso',
    type: [User]
  })
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter todos os usuários' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da mensagem' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuários retornada com sucesso',
    type: User
  })
  findOne(@Param('id') id: string): User {
    const user = this.usersService.findOne(Number(id));
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova mensagem' })
  @ApiBody({ type: UserRequestDTO })
  @ApiResponse({ 
    status: 201, 
    description: 'Mensagem criada com sucesso',
    type: User
  })
  create(@Body() body: UserRequestDTO): User {
    return this.usersService.create(body.name, body.email);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar mensagem' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UserRequestDTO })
  @ApiResponse({ status: 200, description: 'Mensagem atualizada', type: User })
  update(@Param('id') id: string, @Body() body: UserRequestDTO): User {
    const updated = this.usersService.update(Number(id), body.name, body.email);
    if (!updated) throw new NotFoundException('Usuário não encontrado');
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar mensagem' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Mensagem deletada' })
  remove(@Param('id') id: string): User {
    const deleted = this.usersService.remove(Number(id));
    if (!deleted) throw new NotFoundException('Usuário não encontrado');
    return deleted;
  }
}
