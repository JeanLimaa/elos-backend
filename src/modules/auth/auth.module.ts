import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: {
        expiresIn: process.env.NODE_ENV === 'development' ? '90d' : '3m',
      }, // longo tempo de expiração, para, a principio, evitar o refresh token no front-end.
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
