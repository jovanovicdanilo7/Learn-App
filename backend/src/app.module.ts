import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'photos'),  // Path to your static files
      serveRoot: '/uploads/photos',  // URL path to access files
    }),
    UserModule],
})
export class AppModule {}
