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

@Injectable()
export class ComplaintsService {
  private readonly attachmentsBaseUrl = `${process.env.BASE_URL}/upload`;

  constructor(
    private prisma: DatabaseService,
    private readonly complaintAttachmentsService: ComplaintAttachmentsService,
  ) {}

  async create(
    dto: CreateComplaintDto,
    files: Express.Multer.File[],
    user: UserPayload,
  ): Promise<CreateComplaintDto> {
    const complaint = await this.prisma.complaint.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        location: dto.location,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
        user: {
          connect: { id: user.id },
        },
      },
    });

    const attachmentsUrls: string[] = [];

    if(files && files.length > 0) {
      for (const file of files) {
        const attachment = await this.complaintAttachmentsService.create(
          complaint.id,
          file.filename,
        );

        attachmentsUrls.push(`${this.attachmentsBaseUrl}/${attachment.url}`);
      }
    }

  return {
    ...complaint,
    eventDate: complaint.eventDate.toISOString(),
    attachments: attachmentsUrls,
  };
  }

  async findAll(
    user: UserPayload
  ): Promise<CreateComplaintDto[]> {
    const complaints = await this.prisma.complaint.findMany({
      where: user.role === UserRole.ADMIN ? {} : { userId: user.id },
      include: {
        ComplaintAttachments: {
          select: { url: true },
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

  async findOne(id: string, user: UserPayload): Promise<CreateComplaintDto> {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: Number(id) },
      include: {
        ComplaintAttachments: {
          select: { url: true },
        },
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
}
