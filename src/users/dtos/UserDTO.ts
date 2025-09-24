import { ApiProperty } from "@nestjs/swagger";

export class UserRequestDTO {
    @ApiProperty({
        description: 'Nome do usuário',
        example: 'Alex Alves',
        required: true,
        minLength: 10,
    })
    name: string;
    @ApiProperty({
        description: 'Email do usuário',
        example: 'alex@gmail.com',
        required: true
    })
    email: string;
}