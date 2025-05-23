import {
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class TrainingType {
    @IsString()
    @IsNotEmpty()
    id: string;
  
    @IsString()
    @IsNotEmpty()
    trainingType: string;
  }
  
  export class CreateTrainingDto {
    @IsString()
    @IsNotEmpty()
    studentId: string;
  
    @IsString()
    @IsNotEmpty()
    trainerId: string;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ValidateNested()
    @Type(() => TrainingType)
    type: TrainingType;
  
    @IsString()
    @IsNotEmpty()
    date: string;
  
    @IsNumber()
    duration: number;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  }

  export interface ModifiedTrainings extends CreateTrainingDto {
    trainerName: string;
    specialization: string;
    studentName: string;
  }
  