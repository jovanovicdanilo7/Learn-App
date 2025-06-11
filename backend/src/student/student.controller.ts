import { Body, Controller, Get, HttpCode, InternalServerErrorException, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";

import { StudentService } from "./student.service";

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: {
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth?: string;
      address?: string;
    },
    @Res() res: Response
  ) {
    try {
      const { token, credentials } = await this.studentService.createStudent(dto);

      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${60 * 60 * 24}`);
      res.status(200).json({ credentials });
    } catch (error) {
      console.error("Failed to register student:", error);
      throw new InternalServerErrorException("Could not register student");
    }
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    try {
      return await this.studentService.getAllStudents();
    } catch (error) {
      console.error("Failed to fetch students:", error);
      throw new InternalServerErrorException("Could not retrieve students");
    }
  }

  @Get(':userId')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getByUserId(@Param('userId') userId: string) {
    try {
      return await this.studentService.getStudentByUserId(userId);
    } catch (error) {
      console.error("Failed to fetch student by id:", error);
      throw new InternalServerErrorException("Could not retrieve student by user id");
    }
  }

  @Put(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async updateStudent(
    @Param('id') id: string,
    @Body() dto: { dateOfBirth?: string; address?: string }
  ) {
    try {
      return await this.studentService.updateStudent(id, dto);
    } catch (error) {
      console.error("Failed to update student data:", error);
      throw new InternalServerErrorException("Could not update student data");
    }
  }

  @Get('id/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getById(@Param('id') id: string) {
    try {
      return await this.studentService.getStudentById(id);
    } catch (error) {
      console.error("Failed to fetch student by id:", error);
      throw new InternalServerErrorException("Could not retrieve student by id");
    }
  }
}
