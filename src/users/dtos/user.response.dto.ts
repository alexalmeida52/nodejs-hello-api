import { ApiProperty } from "@nestjs/swagger";

export class User {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1
  })
  public id: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Alex'
  })
  public name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'alex@gmail.com'
  })
  public email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
  
}