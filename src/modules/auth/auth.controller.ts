import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação de Usuário')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({
    description: 'Dados para registro de usuário',
    type: CreateAuthDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso.',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto): Promise<{ token: string }> {
    return this.authService.register(createAuthDto);
  }

  @ApiOperation({ summary: 'Login de usuário' })
  @ApiBody({ description: 'Dados para login de usuário', type: LoginAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário logado com sucesso.',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @HttpCode(200)
  @Post('login')
  login(@Body() createAuthDto: LoginAuthDto): Promise<{ token: string }> {
    return this.authService.login(createAuthDto);
  }
}
