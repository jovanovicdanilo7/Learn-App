import { Body, HttpCode, Post, Controller } from "@nestjs/common";
import { TrainingService } from "./training.service";
import { CreateTrainingDto } from "./create-training.dto";

@Controller('trainings')
export class TrainingControler {
    constructor (private trainingService: TrainingService) {}

    @Post('/')
    @HttpCode(200)
    async createTraining(@Body() training: CreateTrainingDto) {
        return this.trainingService.createTraining(training);
    }
}