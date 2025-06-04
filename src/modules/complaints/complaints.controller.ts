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
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint.dto';
import { ComplaintsService } from './complaints.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/Roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Complaints')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

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
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() dto: CreateComplaintDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    return this.complaintsService.create(dto, files, req.user);
  }

  @Get()
  async findAll(@Request() req) {
    return this.complaintsService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.complaintsService.findOne(id, req.user);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @Roles([UserRole.ADMIN])
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateComplaintStatusDto,
  ) {
    return this.complaintsService.updateStatus(id, dto);
  }
}
