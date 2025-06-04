/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComplaintType } from '@prisma/client';

export class CreateComplaintDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  type: ComplaintType; 
  
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  location: string;

  @IsDateString()
  @ApiProperty()
  eventDate: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: any;
}

