import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { TrainerToStudentController } from './trainer-to-student.controller';
import { TrainerToStudentService } from './trainer-to-student.service';

@Module({
  imports: [
      PassportModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
      }),
    ],
  controllers: [TrainerToStudentController],
  providers: [TrainerToStudentService],
})
export class TrainerToStudentModule {}
