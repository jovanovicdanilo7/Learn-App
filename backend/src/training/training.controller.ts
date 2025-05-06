import { Body, HttpCode, Post, Controller, Get, Query } from "@nestjs/common";
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

    @Get('/')
    @HttpCode(200)
    async getAllTrainings() {
        return this.trainingService.getAllTrainings();
    }

    @Get('search')
    @HttpCode(200)
    async searchTrainings(
      @Query('name') name?: string,
      @Query('trainingType') trainingType?: string,
      @Query('date') date?: string
    ) {
      return this.trainingService.searchTrainings({ name, trainingType, date });
    }
}