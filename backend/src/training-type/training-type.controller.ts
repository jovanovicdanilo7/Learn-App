import { Controller, Get } from "@nestjs/common";
import { TrainingTypeService } from "./training-type.service";

@Controller('training-types')
export class TrainingTypeController {
    constructor(private readonly trainingTypeService: TrainingTypeService) {}

    @Get('/')
    async getAll() {
        return this.trainingTypeService.getAll();
    }
}