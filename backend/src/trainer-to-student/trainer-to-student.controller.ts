import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { TrainerToStudentService } from './trainer-to-student.service';

@Controller('trainer-to-student')
export class TrainerToStudentController {
  constructor(private readonly trainerToStudentService: TrainerToStudentService) {}

  @Post()
  @HttpCode(201)
  create(@Body() dto: { trainerId: string; studentId: string }) {
    return this.trainerToStudentService.create(dto);
  }

  @Get()
  @HttpCode(200)
  getAll() {
    return this.trainerToStudentService.getAll();
  }
}
