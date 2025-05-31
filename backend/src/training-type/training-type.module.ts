import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { TrainingTypeController } from "./training-type.controller";
import { TrainingTypeService } from "./training-type.service";

@Module({
  imports: [
      PassportModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
      }),
    ],
  controllers: [TrainingTypeController],
  providers: [TrainingTypeService]
})
export class TrainingTypeModule {}