import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginAuthDto {
    @ApiProperty({
        description: 'Endereço de e-mail do usuário',
        example: 'usuario@email.com'
    })
    @IsNotEmpty({message: 'E-mail é obrigatório.'})
    email: string;

    @ApiProperty({
        description: 'Senha do usuário',
        example: 'minhasenha123'
    })
    @IsNotEmpty({message: 'Senha é obrigatória.'})
    password: string;
}