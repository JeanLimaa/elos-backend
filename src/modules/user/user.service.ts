import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  public async findMe(userId: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const { password, createdAt, ...userData} = user;

    return userData as UserResponseDto;
  }

  public async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const { password, createdAt, ...userData } = user;

    return userData as UserResponseDto;
  }

  public async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async create(data: Prisma.UserCreateInput) {
    const userExists = await this.findUserByEmail(data.email);

    if (userExists) {
      throw new BadRequestException('Usuário com este e-mail já existe.');
    }

    return this.prisma.user.create({
      data: {
        ...data,
        role: UserRole.USER,
      },
    });
  }

  public async findOrThrowUserById(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const { password, createdAt, ...userData } = user;

    return userData as UserResponseDto;
  }
}
