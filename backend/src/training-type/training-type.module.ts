import { Module } from "@nestjs/common";
import { TrainingTypeController } from "./training-type.controller";
import { TrainingTypeService } from "./training-type.service";

@Module({
    controllers: [TrainingTypeController],
    providers: [TrainingTypeService]
})
export class TrainingTypeModule {}