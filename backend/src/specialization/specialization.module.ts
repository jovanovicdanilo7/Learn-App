import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { SpecializationsController } from "./specialization.controller";
import { SpecializationsService } from "./specialization.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [SpecializationsController],
  providers: [SpecializationsService]
})

export class SpecializationsModule {}