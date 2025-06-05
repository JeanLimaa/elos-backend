import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint.dto';
import { UserRole } from '@prisma/client';
import { UserPayload } from '../auth/interfaces/UserPayload.interface';
import { ComplaintAttachmentsService } from '../complaint-attachments/complaint-attachments.service';
import { ComplaintResponseDto } from './dto/complaint-response.dto';

@Injectable()
export class ComplaintsService {
  private readonly attachmentsBaseUrl = `${process.env.BASE_URL}/uploads`;

  constructor(
    private prisma: DatabaseService,
    private readonly complaintAttachmentsService: ComplaintAttachmentsService,
  ) {}

  async create(
    dto: CreateComplaintDto,
    files: Express.Multer.File[],
    user: UserPayload,
  ): Promise<ComplaintResponseDto> {
    const { type, title, description, eventDate, location } = dto;
    const { state, city, location: address } = location;

    const complaint = await this.prisma.complaint.create({
      data: {
        type,
        title,
        description,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        complaintLocation: {
          create: {
            location: address,
            state,
            city,
          },
        },
        user: {
          connect: { id: user.id },
        },
      },
      include: {
        complaintLocation: {select: {location: true, state: true, city: true}
        },
      },
    });

    const attachments = files?.length ? await this.saveAttachments(complaint.id, files) : [];

    return {
      ...complaint,
      eventDate: complaint.eventDate.toISOString(),
      attachments,
    };
  }

  private async saveAttachments(complaintId: number, files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(
      files.map(async (file) => {
        const attachment = await this.complaintAttachmentsService.create(complaintId, file.filename);
        return `${this.attachmentsBaseUrl}/${attachment.url}`;
      })
    );
  }

  async findAll(
    user: UserPayload
  ): Promise<ComplaintResponseDto[]> {
    const complaints = await this.prisma.complaint.findMany({
      where: user.role === UserRole.ADMIN ? {} : { userId: user.id },
      include: {
        ComplaintAttachments: {
          select: { url: true },
        },
        complaintLocation: {
          select: {
            location: true,
            state: true,
            city: true,
          },
        },
      },
    });

    return complaints.map((complaint) => {
      const attachments = complaint.ComplaintAttachments.map((attachment) => `${this.attachmentsBaseUrl}/${attachment.url}`);

      const { ComplaintAttachments, eventDate, ...rest } = complaint;

      return {
        ...rest,
        eventDate: eventDate.toISOString(),
        attachments,
      };
    });
  }

  async findOne(id: string, user: UserPayload): Promise<ComplaintResponseDto> {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: Number(id) },
      include: {
        ComplaintAttachments: {
          select: { url: true },
        },
        complaintLocation: {
          select: {
            location: true,
            state: true,
            city: true,
          },
        }
      }
    });
    if (!complaint) throw new NotFoundException();

    if (user.role !== UserRole.ADMIN && complaint.userId !== user.id) {
      throw new ForbiddenException();
    }

    return {
      ...complaint,
      eventDate: complaint.eventDate.toISOString(),
      attachments: complaint.ComplaintAttachments.map((attachment) => `${this.attachmentsBaseUrl}/${attachment.url}`),
    }
  }

  async updateStatus(id: string, dto: UpdateComplaintStatusDto) {
    return this.prisma.complaint.update({
      where: { id: Number(id) },
      data: {
        status: { set: dto.status },
        adminResponse: dto.adminResponse,
      },
    });
  }

  async remove(id: string, userId: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: Number(id) },
    });

    if (!complaint) {
      throw new NotFoundException('Denúncia não encontrada');
    }

    if (complaint.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover esta denúncia');
    }

    await this.prisma.complaint.delete({
      where: { id: Number(id) },
    });
  }
}
