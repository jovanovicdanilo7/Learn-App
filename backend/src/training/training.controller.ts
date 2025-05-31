import { Body, HttpCode, Post, Controller, Get, Query, UseGuards, InternalServerErrorException } from "@nestjs/common";

import { TrainingService } from "./training.service";
import { CreateTrainingDto } from "./create-training.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('trainings')
export class TrainingControler {
    constructor (private trainingService: TrainingService) {}

    @Post()
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() training: CreateTrainingDto) {
      try {
        return await this.trainingService.createTraining(training);
      } catch (error) {
        console.error("Failed to create training:", error);
        throw new InternalServerErrorException("Could not create training");
      }
    }

    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async getAll() {
      try {
        return await this.trainingService.getAllTrainings();
      } catch (error) {
        console.error("Failed to fetch trainings:", error);
        throw new InternalServerErrorException("Could not fetch trainings");
      }
    }

    @Get('search')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async search(
      @Query('dateFrom') dateFrom?: string,
      @Query('dateTo') dateTo?: string,
      @Query('specialization') specialization?: string,
      @Query('trainerName') trainerName?: string,
      @Query('studentName') studentName?: string
    ) {
      try {
        return await this.trainingService.searchTrainings({
          dateFrom,
          dateTo,
          specialization,
          trainerName,
          studentName,
        });
      } catch (error) {
        console.error("Failed to get trainings by filter:", error);
        throw new InternalServerErrorException("Could not get trainings by filter");
      }
    }
}