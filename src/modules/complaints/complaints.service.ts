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

@Injectable()
export class ComplaintsService {
  constructor(private prisma: DatabaseService) {}

  async create(
    dto: CreateComplaintDto,
    files: Express.Multer.File[],
    user: UserPayload,
  ) {
    const attachmentUrl = files && files.length > 0 ? files[0].filename : null;

    const complaint = await this.prisma.complaint.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        location: dto.location,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
        attachmentUrl,
        user: {
          connect: { id: user.id },
        },
      },
    });

    if (attachmentUrl) {
      complaint.attachmentUrl = `${process.env.BASE_URL}/uploads/${attachmentUrl}`;
    }

    return complaint;
  }

  async findAll(user: UserPayload) {
    if (user.role === UserRole.ADMIN) {
      return this.prisma.complaint.findMany();
    }

    return this.prisma.complaint.findMany({
      where: { userId: user.id },
    });
  }

  async findOne(id: string, user: UserPayload) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: Number(id) },
    });
    if (!complaint) throw new NotFoundException();

    if (user.role !== UserRole.ADMIN && complaint.userId !== user.id) {
      throw new ForbiddenException();
    }

    return complaint;
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
