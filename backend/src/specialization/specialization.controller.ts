import { Controller, Get } from "@nestjs/common";
import { SpecializationsService } from "./specialization.service";

@Controller('specializations')
export class SpecializationsController {
    constructor(private readonly specializationsService: SpecializationsService) {}

    @Get()
    async getAll() {
        return this.specializationsService.getAll();
    }
}