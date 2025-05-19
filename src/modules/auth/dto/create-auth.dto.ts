import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length, MaxLength } from "class-validator";

export class CreateAuthDto {
    @ApiProperty()
    @IsEmail({}, { message: 'E-mail inválido.' })
    @MaxLength(191, { message: 'E-mail deve ter no máximo 191 caracteres.' })
    email: string;

    @ApiProperty()
    @Length(8, 191, { message: 'Senha deve ter no minímo 8 e no máximo 191 caracteres.' })
    password: string;

    @ApiProperty()
    @Length(6, 40, { message: 'Nome deve no minímo 6 e no máximo 40 caracteres.' })
    name: string;
}
