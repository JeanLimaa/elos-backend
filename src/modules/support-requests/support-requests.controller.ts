import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestStatusDto } from './dto/update-support-request.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/GetUser.decorator';
import { RoleGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { SupportRequest, User, UserRole } from '@prisma/client';
import { UserPayload } from '../auth/interfaces/UserPayload.interface';
import { SupportRequestResponseDto } from './dto/support-request-response.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
@ApiTags('Solicitações de Apoio')
@Controller('support-requests')
export class SupportRequestsController {
  constructor(
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  @ApiOperation({ summary: 'Criar nova solicitação de apoio' })
  @ApiBody({
    description: 'Dados para criação da solicitação de apoio',
    type: CreateSupportRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Solicitação de apoio criada com sucesso.',
    type: SupportRequestResponseDto,
  })
  @Roles([UserRole.USER])
  @Post()
  create(
    @Body() createSupportRequestDto: CreateSupportRequestDto,
    @GetUser('id') userId: number,
  ): Promise<Omit<SupportRequest, 'userId'>> {
    return this.supportRequestsService.create(createSupportRequestDto, userId);
  }

  @ApiOperation({
    summary:
      'Listar todas as solicitações de apoio (Todas solicitações do usuario. No caso de ADMINS, retorna todas as solicitações pendentes)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitações de apoio.',
    type: SupportRequestResponseDto,
    isArray: true,
  })
  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.supportRequestsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Buscar uma solicitação de apoio por ID' })
  @ApiParam({ name: 'id', description: 'ID da solicitação de apoio' })
  @ApiResponse({
    status: 200,
    description: 'Solicitação de apoio encontrada.',
    type: SupportRequestResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: UserPayload) {
    return this.supportRequestsService.findOne(id, user.id, user.role);
  }
  
  @ApiOperation({ summary: 'Atualizar o status de uma solicitação de apoio' })
  @ApiParam({ name: 'id', description: 'ID da solicitação de apoio' })
  @ApiBody({
    description: 'Dados para atualização do status da solicitação de apoio',
    type: UpdateSupportRequestStatusDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Status da solicitação de apoio atualizado com sucesso.',
    type: SupportRequestResponseDto,
  })
  @Roles([UserRole.ADMIN])
  @Patch(':id/status')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateSupportRequestStatusDto: UpdateSupportRequestStatusDto,
    @GetUser('id') adminId: number,
  ) {
    return this.supportRequestsService.updateStatus(
      id,
      adminId,
      UpdateSupportRequestStatusDto,
    );
  }

  @ApiOperation({ summary: 'Remover uma solicitação de apoio' })
  @ApiParam({ name: 'id', description: 'ID da solicitação de apoio' })
  @ApiResponse({
    status: 200,
    description: 'Solicitação de apoio removida com sucesso.',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.supportRequestsService.remove(id);
  }
}
