import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ComplaintAttachmentsModule } from '../complaint-attachments/complaint-attachments.module';

@Module({
  imports: [DatabaseModule, ComplaintAttachmentsModule],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
