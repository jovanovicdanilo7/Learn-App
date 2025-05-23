import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { StudentService } from "./student.service";

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(201)
  createStudent(@Body() dto: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    address?: string;
  }) {
    return this.studentService.create(dto);
  }
}
