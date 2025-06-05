import { Module } from '@nestjs/common';
import { ComplaintAttachmentsService } from './complaint-attachments.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ComplaintAttachmentsService],
  exports: [ComplaintAttachmentsService],
})
export class ComplaintAttachmentsModule {}
