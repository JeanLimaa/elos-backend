import { ApiProperty } from "@nestjs/swagger";
import { RequestType } from "@prisma/client";
import { IsString, Length } from "class-validator";
import { IsEnum } from "class-validator";

export class CreateSupportRequestDto {
    @ApiProperty({description: 'Descrição da solicitação de apoio'})
    @IsString({message: 'A descrição deve ser uma string'})
    @Length(3, 190, {message: 'A descrição deve ter entre 3 e 190 caracteres'})
    description: string;

    @ApiProperty({enum: RequestType, description: 'Tipo de solicitação de apoio'})
    @IsEnum(RequestType, { message: `O tipo de solicitação deve ser um valor válido: ${Object.values(RequestType).join(', ')}` })
    type: RequestType;
}
