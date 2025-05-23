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
      @Query('dateFrom') dateFrom?: string,
      @Query('dateTo') dateTo?: string,
      @Query('specialization') specialization?: string,
      @Query('trainerName') trainerName?: string,
      @Query('studentName') studentName?: string
    ) {
      return this.trainingService.searchTrainings({
        dateFrom,
        dateTo,
        specialization,
        trainerName,
        studentName,
      });
    }
}