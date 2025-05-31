import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { UserModule } from './user/user.module';
import { TrainingModule } from './training/training.module';
import { TrainingTypeModule } from './training-type/training-type.module';
import { SpecializationsModule } from './specialization/specialization.module';
import { TrainerModule } from './trainer/trainer.module';
import { StudentModule } from './student/student.module';
import { TrainerToStudentModule } from './trainer-to-student/trainer-to-student.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'photos'),
      serveRoot: '/uploads/photos',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TrainingModule,
    TrainingTypeModule,
    SpecializationsModule,
    TrainerModule,
    StudentModule,
    TrainerToStudentModule,
  ],
})
export class AppModule {}
