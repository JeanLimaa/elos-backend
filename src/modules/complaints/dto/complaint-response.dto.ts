import { ApiProperty } from "@nestjs/swagger";
import { ComplaintType } from "@prisma/client";

export class ComplaintLocationResponseDto {
  @ApiProperty()
  location: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;
}

export class ComplaintResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: ComplaintType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  eventDate: string;

  @ApiProperty({ type: [String] })
  attachments: string[];

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: ComplaintLocationResponseDto })
  complaintLocation: ComplaintLocationResponseDto;
}
