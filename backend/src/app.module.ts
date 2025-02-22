import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestsController } from './tests/tests.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController, TestsController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
