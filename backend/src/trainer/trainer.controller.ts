import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { TrainerService } from "./trainer.service";

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post()
  @HttpCode(201)
  createTrainer(@Body() dto: {
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
  }) {
    return this.trainerService.create(dto);
  }

  @Get()
  @HttpCode(200)
  getTrainers() {
    return this.trainerService.getAllTrainers();
  }
}
