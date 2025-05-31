import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { TrainerController } from "./trainer.controller";
import { TrainerService } from "./trainer.service";

@Module({
  imports: [
      PassportModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
      }),
    ],
  controllers: [TrainerController],
  providers: [TrainerService]
})
export class TrainerModule {}