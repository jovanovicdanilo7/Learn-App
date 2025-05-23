import { Module } from '@nestjs/common';
import { TrainerToStudentController } from './trainer-to-student.controller';
import { TrainerToStudentService } from './trainer-to-student.service';

@Module({
  controllers: [TrainerToStudentController],
  providers: [TrainerToStudentService],
})
export class TrainerToStudentModule {}
