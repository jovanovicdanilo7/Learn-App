import { Body, Controller, Get, HttpCode, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TrainerToStudentService } from './trainer-to-student.service';

@Controller('trainer-to-student')
export class TrainerToStudentController {
  constructor(private readonly trainerToStudentService: TrainerToStudentService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: { trainerId: string; studentId: string }) {
    try {
      return await this.trainerToStudentService.createTrainerToStudent(dto);
    } catch (error) {
      console.error("Failed to create trainer to student relation:", error);
      throw new InternalServerErrorException("Could not create trainer to student relation");
    }
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    try {
      return await this.trainerToStudentService.getAllRelations();
    } catch (error) {
      console.error("Failed to fetch trainer to student relation:", error);
      throw new InternalServerErrorException("Could not retreive trainer to student relation");
    }
  }
}
