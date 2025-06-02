import { Body, Controller, ForbiddenException, Get, HttpCode, InternalServerErrorException, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";

import { TrainerService } from "./trainer.service";

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: {
      firstName: string;
      lastName: string;
      email: string;
      specialization: string;
    },
    @Res({ passthrough: true }) response: Response
  ) {
    const { token, credentials } = await this.trainerService.createTrainer(dto);

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
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    try {
      return await this.trainerService.getAllTrainers();
    } catch (error) {
      console.error("Failed to fetch trainers:", error);
      throw new InternalServerErrorException("Could not retrieve trainers");
    }
  }

  @Get(':userId')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getByUserId(@Param('userId') userId: string) {
    try {
      return await this.trainerService.getTrainerByUserId(userId);
    } catch (error) {
      console.error("Failed to fetch trainer by user id:", error);
      throw new InternalServerErrorException("Could not retrieve trainer by user id");
    }
  }

  @Put(":userId")
  @HttpCode(200)
  @UseGuards(AuthGuard("jwt"))
  async updateTrainerSpecialization(
    @Param("userId") userId: string,
    @Body() body: { specializationId: string },
  ) {
    return await this.trainerService.updateTrainerSpecializationByUserId(
      userId,
      body.specializationId
    );
  }

  @Get('id/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getById(@Param('id') id: string) {
    try {
      return await this.trainerService.getTrainerById(id);
    } catch (error) {
      console.error("Failed to fetch trainer by id:", error);
      throw new InternalServerErrorException("Could not retrieve trainer by id");
    }
  }
}
