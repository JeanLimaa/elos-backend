import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length, MaxLength } from "class-validator";

export class CreateAuthDto {
  @ApiProperty({
    description: 'Endereço de e-mail do usuário',
    example: 'usuario@email.com',
    maxLength: 191,
  })
  @IsEmail({}, { message: 'E-mail inválido.' })
  @MaxLength(191, { message: 'E-mail deve ter no máximo 191 caracteres.' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 8 caracteres)',
    example: 'minhasenha123',
    minLength: 8,
    maxLength: 191,
  })
  @Length(8, 191, { message: 'Senha deve ter no minímo 8 e no máximo 191 caracteres.' })
  password: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Jean Lima',
    minLength: 4,
    maxLength: 40,
  })
  @Length(4, 40, { message: 'Nome deve no minímo 4 e no máximo 40 caracteres.' })
  name: string;
}
