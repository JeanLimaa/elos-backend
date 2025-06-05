import { IsString, IsDateString, IsOptional, IsEnum, MaxLength, ValidateNested, IsNotEmpty, isNotEmptyObject, IsNotEmptyObject, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComplaintType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class ComplaintLocationDto {
  @IsString({message: 'A localização deve ser uma string'})
  @IsOptional()
  @ApiProperty({description: 'Localização da denúncia', required: false})
  location: string;

  
  @IsString({message: 'A cidade deve ser uma string'})
  @IsOptional()
  @ApiProperty({description: 'Cidade da denúncia', required: false})
  city: string;

  @IsString({message: 'o Estado é obrigatorio e deve ser uma string'})
  @MinLength(2, { message: 'O estado não pode estar vazio e deve ter ao menos 2 caracteres' })
  @IsNotEmpty({message: 'O estado é obrigatório'})
  @ApiProperty({description: 'Estado da denúncia'})
  state: string;
}

export class CreateComplaintDto {
  @IsEnum(ComplaintType, {
    message: 'O tipo de denúncia deve ser um dos seguintes:' + Object.values(ComplaintType).join(', '),
  })
  @ApiProperty({enum: ComplaintType})
  type: ComplaintType; 
  
  @IsString({message: 'O título deve ser uma string',})
  title: string;

  @MaxLength(255, {message: 'A descrição não pode exceder 255 caracteres',})
  @IsString({message: 'A descrição deve ser uma string',})
  @ApiProperty({
    maxLength: 255,
  })
  description: string;
  
  @ApiProperty({ type: () => ComplaintLocationDto })
  @ValidateNested({message: 'O campo location deve ser um objeto válido'})
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @Type(() => ComplaintLocationDto)
  location: ComplaintLocationDto;

  @IsDateString({}, {message: 'A data do evento deve ser uma string no formato de data ISO'})
  @ApiProperty({example: '2023-10-01T00:00:00Z'})
  eventDate: string;

  @IsOptional()
  @ApiProperty({ 
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    }, 
    required: false 
  })
  attachments?: string[];
}