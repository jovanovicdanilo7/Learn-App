import { Module } from "@nestjs/common";
import { TrainingControler } from "./training.controller";
import { TrainingService } from "./training.service";

@Module({
    controllers: [TrainingControler],
    providers: [TrainingService]
})
export class TrainingModule {}