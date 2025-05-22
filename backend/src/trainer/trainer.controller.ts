import { Body, Controller, HttpCode, Post } from "@nestjs/common";
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
    specializationId: string;
  }) {
    return this.trainerService.create(dto);
  }
}
