import { Body, Controller, Get, HttpCode, InternalServerErrorException, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
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
    @Res() res: Response
  ) {
    try {
      const { token, credentials } = await this.trainerService.createTrainer(dto);

      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${60 * 60 * 24}`);
      res.status(200).json({ credentials });
    } catch (error) {
      console.error("Failed to register trainer:", error);
      throw new InternalServerErrorException("Could not register trainer");
    }
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
