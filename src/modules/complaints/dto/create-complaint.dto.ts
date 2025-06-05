import { IsString, IsDateString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComplaintType } from '@prisma/client';

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

  @IsString({message: 'A localização deve ser uma string',})
  @ApiProperty()
  location: string;

  @IsDateString({}, {message: 'A data do evento deve ser uma string no formato de data ISO'})
  @ApiProperty({example: '2023-10-01T00:00:00Z'})
  eventDate: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  attachments?: Express.Multer.File | null;
}