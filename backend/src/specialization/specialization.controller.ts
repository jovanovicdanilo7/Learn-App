import { Controller, Get, HttpCode, InternalServerErrorException, UseGuards } from "@nestjs/common";

import { SpecializationsService } from "./specialization.service";

@Controller('specializations')
export class SpecializationsController {
  constructor(private readonly specializationsService: SpecializationsService) {}

  @Get()
  @HttpCode(200)
  async getAll() {
    try {
      return await this.specializationsService.getAllSpecializations();
    } catch (error) {
      console.error("Failed to fetch specializations:", error);
      throw new InternalServerErrorException("Could not retrieve specializations");
    }
  }
}