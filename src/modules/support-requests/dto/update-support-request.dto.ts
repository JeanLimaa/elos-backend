import { PartialType } from '@nestjs/mapped-types';
import { CreateSupportRequestDto } from './create-support-request.dto';
import { ComplaintStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateSupportRequestDto extends PartialType(CreateSupportRequestDto) {}

export class UpdateSupportRequestStatusDto {
    @ApiProperty({ enum: ComplaintStatus, description: 'Status da solicitação de apoio' })
    @IsEnum(ComplaintStatus, { message: `O novo status deve ser um valor válido: ${Object.values(ComplaintStatus).join(', ')}` })
    status: ComplaintStatus;
}