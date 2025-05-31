import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { TrainingControler } from "./training.controller";
import { TrainingService } from "./training.service";

@Module({
  imports: [
      PassportModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
      }),
    ],
  controllers: [TrainingControler],
  providers: [TrainingService]
})
export class TrainingModule {}