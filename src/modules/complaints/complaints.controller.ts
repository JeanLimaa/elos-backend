import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint.dto';
import { ComplaintsService } from './complaints.service';
import { Roles } from 'src/decorators/Roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/roles.guard';
import { GetUser } from 'src/decorators/GetUser.decorator';
import { UserPayload } from '../auth/interfaces/UserPayload.interface';

class ComplaintResponseDto extends CreateComplaintDto {
  adminResponse?: string;
}

@ApiTags('Denúncias - Complaints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(
    private readonly complaintsService: ComplaintsService
  ) {}

  @ApiOperation({ summary: 'Criar nova denúncia' })
  @ApiResponse({
    status: 201,
    description: 'Denúncia criada com sucesso',
    type: ComplaintResponseDto
  })
  @ApiBody({
    description: 'Dados para criação da denúncia',
    type: CreateComplaintDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(
    FilesInterceptor('attachments', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}-${file.originalname}`);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateComplaintDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: UserPayload,
  ) {
    return this.complaintsService.create(dto, files, user);
  }
  
  @ApiOperation({ summary: 'Buscar todas as denúncias de um usuario. Se for admin, a de todos usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de denúncias',
    type: ComplaintResponseDto,
    isArray: true,
  })  
  @HttpCode(200)
  @Get()
  async findAll(
    @GetUser() user: UserPayload
  ) {
    return this.complaintsService.findAll(user);
  }

  @ApiOperation({ summary: 'Buscar uma denúncia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Denúncia encontrada',
    type: ComplaintResponseDto,
  })
  @HttpCode(200)
  @Get(':id')
  async findOne(
    @Param('id') id: string, 
    @GetUser() user: UserPayload
  ) {
    return this.complaintsService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Atualizar o status de uma denúncia (Somente admin)' })
  @ApiResponse({
    status: 200,
    description: 'Status da denúncia atualizado com sucesso'
  })
  @HttpCode(200)
  @Patch(':id/status')
  @Roles([UserRole.ADMIN])
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateComplaintStatusDto,
  ) {
    return this.complaintsService.updateStatus(id, dto);
  }

  @ApiOperation({ summary: 'Marcar uma denúncia como completa (Somente usuario comum)' })
  @ApiResponse({
    status: 200,
    description: 'Status da denúncia atualizado com sucesso'
  })
  @HttpCode(200)
  @Patch(':id/status/completed')
  @Roles([UserRole.USER])
  async markAsCompleted(
    @Param('id') id: string,
  ) {
    return this.complaintsService.updateStatus(id, { status: 'COMPLETED' });
  }

  @ApiResponse({
    status: 200,
    description: 'Denúncia removida com sucesso',
  })
  @HttpCode(200)
  @ApiOperation({ summary: 'Remover uma denúncia' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUser("id") userId: number
  ) {
    return this.complaintsService.remove(id, userId);
  }
}
