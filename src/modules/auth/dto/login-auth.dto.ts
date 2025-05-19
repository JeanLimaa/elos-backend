import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginAuthDto {
    @ApiProperty()
    @IsNotEmpty({message: 'E-mail é obrigatório.'})
    email: string;

    @ApiProperty()
    @IsNotEmpty({message: 'Senha é obrigatória.'})
    password: string;
}