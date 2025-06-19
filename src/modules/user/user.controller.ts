import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/decorators/Roles.decorator';
import { RoleGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user.dto';
import { UserService } from './user.service';
import { GetUser } from 'src/decorators/GetUser.decorator';

@ApiTags('Usuarios')
@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('me')
    @ApiOperation({ summary: 'Obter informações do própio usuario logado' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    getMe(
        @GetUser('id') userId: number,
    ): Promise<UserResponseDto> {
        return this.userService.findMe(userId);
    }

    @Get(':id')
    @UseGuards(RoleGuard)
    @Roles([UserRole.ADMIN])
    @ApiOperation({ summary: 'Obter informações do usuario por id (admin only)' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, type: UserResponseDto })
    getUserById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<UserResponseDto> {
        return this.userService.findUserById(id);
    }
}