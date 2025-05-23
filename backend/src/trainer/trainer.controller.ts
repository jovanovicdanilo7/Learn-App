import { Body, Controller, Get, HttpCode, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { TrainerService } from "./trainer.service";

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post()
  @HttpCode(201)
  async createTrainer( @Body() dto: {
      firstName: string;
      lastName: string;
      email: string;
      specialization: string;
    },
    @Res({ passthrough: true }) response: Response
  ) {
    const { token, credentials } = await this.trainerService.create(dto);

    response.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { credentials };
  }

  @Get()
  @HttpCode(200)
  getTrainers() {
    return this.trainerService.getAllTrainers();
  }
}
