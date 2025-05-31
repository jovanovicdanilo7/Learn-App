import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";

@Module({
  imports: [
      PassportModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
      }),
    ],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}