import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestStatusDto } from './dto/update-support-request.dto';
import { DatabaseService } from 'src/database/database.service';
import { SupportRequest, UserRole } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class SupportRequestsService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly userService: UserService
  ) {}

  public async create(createSupportRequestDto: CreateSupportRequestDto, userId: number): Promise<Omit<SupportRequest, "userId">> {
    const { userId: __, ...supportRequest } = await this.prisma.supportRequest.create({
      data: {
        description: createSupportRequestDto.description,
        type: createSupportRequestDto.type,
        userId,
        title: createSupportRequestDto.title,
      }
    });

    return supportRequest;
  }

  public async findAll(userId: number): Promise<SupportRequest[]> {
    const user = await this.userService.findUserById(userId);

    switch(user.role) {
      case UserRole.USER:
        return await this.prisma.supportRequest.findMany({where: { userId }});
      case UserRole.ADMIN:
        return await this.prisma.supportRequest.findMany({
          where: { 
            OR: [
              { handledById: userId },
              { handledById: null }
            ]
           }
        });
    }
  }

  public async findOne(id: number, userId: number, userRole: UserRole) {
    const supportRequest = await this.findSupportRequestById(id);

    if(supportRequest.userId !== userId && userRole !== UserRole.ADMIN) {
      throw new UnauthorizedException('Você não tem permissão para acessar esta solicitação de apoio');
    }

    return supportRequest;
  }

  public async updateStatus(id: number, adminId: number, updateSupportRequestDto: UpdateSupportRequestStatusDto) {
    await this.findSupportRequestById(id);

    return await this.prisma.supportRequest.update({
      where: { id },
      data: {
        status: updateSupportRequestDto.status,
        handledById: adminId
      }
    });
  }

  public async remove(id: number) {
    await this.findSupportRequestById(id);

    await this.prisma.supportRequest.delete({
      where: { id }
    });
  }

  private async findSupportRequestById(id: number) {
    const supportRequest = await this.prisma.supportRequest.findUnique({
      where: { id }
    });

    if (!supportRequest) {
      throw new NotFoundException('Solicitação de apoio não encontrada');
    }

    return supportRequest;
  }
}
