import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './interfaces/UserPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  
  public async register(createAuthDto: CreateAuthDto) {
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    return await this.userService.create({
      email: createAuthDto.email,
      password: hashedPassword,
      name: createAuthDto.name,
    });
  }

  public async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findUserByEmail(loginAuthDto.email);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida.');
    }

    const payload: UserPayload =  {
      email: user.email,
      id: user.id,
      name: user.name,
      role: user.role,
    }

    return { 
      token: await this.jwtService.signAsync(payload),
    }
  }
}
