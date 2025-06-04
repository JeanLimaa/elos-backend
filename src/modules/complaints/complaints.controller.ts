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
  Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint.dto';
import { ComplaintsService } from './complaints.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/Roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/roles.guard';
import { GetUser } from 'src/decorators/GetUser.decorator';
import { UserPayload } from '../auth/interfaces/UserPayload.interface';

@ApiTags('Denúncias - Complaints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  
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

  @Get()
  async findAll(
    @GetUser() user: UserPayload
  ) {
    return this.complaintsService.findAll(user);
  }


  @Get(':id')
  async findOne(
    @Param('id') id: string, 
    @GetUser() user: UserPayload
  ) {
    return this.complaintsService.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles([UserRole.ADMIN])
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateComplaintStatusDto,
  ) {
    return this.complaintsService.updateStatus(id, dto);
  }
}
