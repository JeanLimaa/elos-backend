import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { SupportRequestsModule } from './modules/support-requests/support-requests.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ComplaintsModule,
    SupportRequestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
