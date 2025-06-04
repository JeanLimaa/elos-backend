import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateComplaintDto,
    files: Express.Multer.File[],
    user: any,
  ) {
    const attachmentUrl = files && files.length > 0 ? files[0].filename : null;

    const createdComplaint = await this.prisma.complaint.create({
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
      (createdComplaint as any).attachmentUrl =
        `http://localhost:3000/uploads/${attachmentUrl}`;
    }

    return createdComplaint;
  }

  async findAll(user: any) {
    if (user.role === UserRole.ADMIN) {
      return this.prisma.complaint.findMany();
    }

    return this.prisma.complaint.findMany({
      where: { userId: user.id },
    });
  }

  async findOne(id: string, user: any) {
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
