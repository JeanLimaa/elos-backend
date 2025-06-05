import { Injectable, NotFoundException } from '@nestjs/common';
import { ComplaintAttachments } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ComplaintAttachmentsService {
    constructor(
        private readonly prisma: DatabaseService,
    ) {}

    public async create(
        complaintId: number,
        url: string,
    ): Promise<ComplaintAttachments> {
        const complaint = await this.prisma.complaint.findUnique({
            where: { id: complaintId },
        });

        if (!complaint) {
            throw new NotFoundException('Denúncia não encontrada');
        }

        return await this.prisma.complaintAttachments.create({
            data: {
                complaintId,
                url,
            },
        });
    }
}
