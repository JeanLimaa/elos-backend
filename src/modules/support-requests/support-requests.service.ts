import { Injectable } from '@nestjs/common';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UpdateSupportRequestDto } from './dto/update-support-request.dto';

@Injectable()
export class SupportRequestsService {
  create(createSupportRequestDto: CreateSupportRequestDto) {
    return 'This action adds a new supportRequest';
  }

  findAll() {
    return `This action returns all supportRequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supportRequest`;
  }

  update(id: number, updateSupportRequestDto: UpdateSupportRequestDto) {
    return `This action updates a #${id} supportRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} supportRequest`;
  }
}
