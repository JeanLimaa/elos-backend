import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Ping')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Somente para testar API. Verifica se o servidor está ativo' })
  @Get('/ping')
  getHello(): string {
    return this.appService.getHello();
  }
}
