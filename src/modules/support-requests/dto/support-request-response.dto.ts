import { ApiProperty } from '@nestjs/swagger';
import { ComplaintStatus, RequestType } from '@prisma/client';

export class SupportRequestResponseDto {
  @ApiProperty({ example: 9 })
  id: number;

  @ApiProperty({ example: 'Título da solicitação' })
  title: string;

  @ApiProperty({ example: 'JURIDICO', enum: RequestType })
  type: RequestType;

  @ApiProperty({ example: 'Descrição da solicitação' })
  description: string;

  @ApiProperty({ example: new Date().toISOString(), type: String })
  createdAt: Date;

  @ApiProperty({ example: 'RECEIVED', enum: ComplaintStatus })
  status: ComplaintStatus;

  @ApiProperty({ example: null, examples: [null, 1, 2, 3] , nullable: true, description: 'ID do administrador que está lidando com a solicitação' })
  handledById: number | null;
}
