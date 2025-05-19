import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: DatabaseService,
    ) {}

    async findUserById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        };

        return user;
    };

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    };

    async create(data: Prisma.UserCreateInput) {
        const userExists = await this.findUserByEmail(data.email);

        if (userExists) {
            throw new BadRequestException('Usuário com este e-mail já existe.');
        };

        return this.prisma.user.create({
            data: {
                ...data,
                role: UserRole.USER,
            },
        });
    };
}
