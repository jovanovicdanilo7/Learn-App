import { dbDocClient } from "src/database/dynamodb.service";
import { CreateTrainingDto, ModifiedTrainings } from "./create-training.dto";
import { v4 as uuidv4 } from 'uuid'
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';

export class TrainingService {
    async createTraining(training: CreateTrainingDto) {
        const newTraining = {
            id: uuidv4(),
            studentId: training.studentId,
            trainerId: training.trainerId,
            name: training.name,
            type: training.type,
            date: training.date,
            duration: training.duration,
            description: training.description
          };

        await dbDocClient.send(
            new PutCommand({
                TableName: 'Trainings',
                Item: newTraining
            }),
        );

        return {
            newTraining,
        };
    }

    async getAllTrainings() {
        const result = await dbDocClient.send(
            new ScanCommand({
                TableName: 'Trainings',
            }),
        );

        return result.Items?.map(item => unmarshall(item));
    }

    async searchTrainings(filters: {
      dateFrom?: string;
      dateTo?: string;
      specialization?: string;
      trainerName?: string;
    }) {
      const [trainingsRes, trainersRes, usersRes, specializationsRes] = await Promise.all([
        dbDocClient.send(new ScanCommand({ TableName: 'Trainings' })),
        dbDocClient.send(new ScanCommand({ TableName: 'Trainers' })),
        dbDocClient.send(new ScanCommand({ TableName: 'Users' })),
        dbDocClient.send(new ScanCommand({ TableName: 'Specializations' })),
      ]);
    
      const trainings = (trainingsRes.Items?.map(item => unmarshall(item)) ?? []) as CreateTrainingDto[];
      const trainers = trainersRes.Items?.map(item => unmarshall(item)) ?? [];
      const users = usersRes.Items?.map(item => unmarshall(item)) ?? [];
      const specializations = specializationsRes.Items?.map(item => unmarshall(item)) ?? [];
    
      const trainingsToFilter: ModifiedTrainings[] = trainings.map(training => {
        const trainer = trainers.find(t => t.id === training.trainerId);
        const user = users.find(u => u.id === trainer?.userId);
        const spec = specializations.find(s => s.id === trainer?.specializationId);
    
        return {
          ...training,
          trainerName: user?.firstName ?? '',
          specialization: spec?.specialization ?? '',
        };
      });
    
      return trainingsToFilter.filter(training => {
        const trainingDate = new Date(training.date).getTime();
        const dateFrom = filters.dateFrom ? new Date(filters.dateFrom).getTime() : null;
        const dateTo = filters.dateTo ? new Date(filters.dateTo).getTime() : null;
    
        const matchesDateRange =
          (!dateFrom || trainingDate >= dateFrom) &&
          (!dateTo || trainingDate <= dateTo);
    
        const matchesTrainer = filters.trainerName
          ? training.trainerName.toLowerCase().includes(filters.trainerName.toLowerCase())
          : true;
    
        const matchesSpec = filters.specialization
          ? training.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
          : true;
    
        return matchesDateRange && matchesTrainer && matchesSpec;
      });
    }
}