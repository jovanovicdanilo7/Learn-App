import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'photos'),
      serveRoot: '/uploads/photos',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TrainingModule,
  ],
})
export class AppModule {}
