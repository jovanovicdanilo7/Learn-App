import { Module } from "@nestjs/common";
import { SpecializationsController } from "./specialization.controller";
import { SpecializationsService } from "./specialization.service";

@Module({
    controllers: [SpecializationsController],
    providers: [SpecializationsService]
})
export class SpecializationsModule {}