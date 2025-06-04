import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ComplaintStatus } from '@prisma/client';

export class UpdateComplaintStatusDto {
  @IsEnum(ComplaintStatus)
  @ApiProperty({ enum: ComplaintStatus })
  status: ComplaintStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  adminResponse?: string;
}
