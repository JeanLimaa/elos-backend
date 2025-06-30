import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestStatusDto } from './dto/update-support-request.dto';
import { DatabaseService } from 'src/database/database.service';
import { SupportRequest, UserRole } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class SupportRequestsService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly userService: UserService,
  ) {}

  public async create(
    createSupportRequestDto: CreateSupportRequestDto,
    userId: number,
  ): Promise<Omit<SupportRequest, 'userId'>> {
    const { userId: __, ...supportRequest } =
      await this.prisma.supportRequest.create({
        data: {
          description: createSupportRequestDto.description,
          type: createSupportRequestDto.type,
          userId,
          title: createSupportRequestDto.title,
          professionalGenderPreference: createSupportRequestDto.professionalGender,
          attendancePreference: createSupportRequestDto.attendanceType,
        },
      });

    return supportRequest;
  }

  public async findAll(userId: number): Promise<SupportRequest[]> {
    const user = await this.userService.findUserById(userId);

    switch (user.role) {
      case UserRole.USER:
        return await this.prisma.supportRequest.findMany({ where: { userId } });
      case UserRole.ADMIN:
        return await this.prisma.supportRequest.findMany({
          where: {
            OR: [{ handledById: userId }, { handledById: null }],
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        });
    }
  }

  public async findOne(id: number, userId: number, userRole: UserRole) {
    const supportRequest = await this.findOrThrowSupportRequestById(id);

    if (supportRequest.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta solicitação de apoio',
      );
    }

    return supportRequest;
  }

  public async updateStatus(
    id: number,
    adminId: number,
    updateSupportRequestDto: UpdateSupportRequestStatusDto,
  ) {
    await this.findOrThrowSupportRequestById(id);
    await this.userService.findOrThrowUserById(adminId);

    return await this.prisma.supportRequest.update({
      where: { id },
      data: {
        status: updateSupportRequestDto.status,
        handledById: adminId,
      },
    });
  }

  public async updateStatusAsDone(
    id: number,
    userId: number,
    updateSupportRequestDto: UpdateSupportRequestStatusDto,
  ) {
    const supportRequest = await this.findOrThrowSupportRequestById(id);

    if (supportRequest.userId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar o status desta solicitação de apoio',
      );
    }

    if (updateSupportRequestDto.status === 'COMPLETED' && supportRequest.status !== 'FORWARDED') {
      throw new ForbiddenException('Apenas solicitações de apoio encaminhadas podem ser marcadas como concluídas');
    }

    return await this.prisma.supportRequest.update({
      where: { id },
      data: {
        status: updateSupportRequestDto.status,
      },
    });
  }

  public async remove(id: number) {
    await this.findOrThrowSupportRequestById(id);

    await this.prisma.supportRequest.delete({
      where: { id },
    });
  }
  

  private async findOrThrowSupportRequestById(id: number) {
    const supportRequest = await this.prisma.supportRequest.findUnique({
      where: { id },
    });

    if (!supportRequest) {
      throw new NotFoundException('Solicitação de apoio não encontrada');
    }

    return supportRequest;
  }
}
