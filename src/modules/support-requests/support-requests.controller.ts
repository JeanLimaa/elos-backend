import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestStatusDto } from './dto/update-support-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/GetUser.decorator';
import { RoleGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { User, UserRole } from '@prisma/client';
import { UserPayload } from '../auth/interfaces/UserPayload.interface';

@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
@ApiTags('Solicitações de Apoio')
@Controller('support-requests')
export class SupportRequestsController {
  constructor(private readonly supportRequestsService: SupportRequestsService) {}

  @Roles([UserRole.USER])
  @Post()
  create(
    @Body() createSupportRequestDto: CreateSupportRequestDto,
    @GetUser('id') userId: number
  ) {
    return this.supportRequestsService.create(createSupportRequestDto, userId);
  }

  @Get()
  findAll() {
    return this.supportRequestsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserPayload
  ) {
    return this.supportRequestsService.findOne(id, user.id, user.role);
  }

  @Roles([UserRole.ADMIN])
  @Patch(':id/status')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() UpdateSupportRequestStatusDto: UpdateSupportRequestStatusDto,
    @GetUser('id') adminId: number
  ) {
    return this.supportRequestsService.updateStatus(id, adminId, UpdateSupportRequestStatusDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.supportRequestsService.remove(id);
  }
}
