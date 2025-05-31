import { Controller, Get, HttpCode, InternalServerErrorException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { TrainingTypeService } from "./training-type.service";

@Controller('training-types')
export class TrainingTypeController {
  constructor(private readonly trainingTypeService: TrainingTypeService) {}

  @Get('')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    try {
      return await this.trainingTypeService.getAllTrainingTypes();
    } catch (error) {
      console.error("Failed to fetch training types:", error);
      throw new InternalServerErrorException("Could not fetch training types");
    }
  }
}