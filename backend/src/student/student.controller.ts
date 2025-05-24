import { Body, Controller, Get, HttpCode, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { StudentService } from "./student.service";

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(201)
  async createStudent(@Body() dto: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    address?: string;
  },
  @Res({ passthrough: true }) response: Response
  ) {
    const { token, credentials } = await this.studentService.create(dto);

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
  getStudents() {
    return this.studentService.getAllStudents();
  }
}
