import { dbDocClient } from "src/database/dynamodb.service";
import { CreateTrainingDto } from "./create-training.dto";
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
        name?: string;
        trainingType?: string;
        date?: string;
      }) {
        const result = await dbDocClient.send(
          new ScanCommand({
            TableName: 'Trainings',
          }),
        );
      
        const trainings = result.Items?.map(item => unmarshall(item)) ?? [];

        return trainings.filter(training => {
          const matchesName = filters.name
            ? training.name?.toLowerCase().includes(filters.name.toLowerCase())
            : true;

          const matchesType = filters.trainingType
            ? training.type?.trainingType?.toLowerCase().includes(filters.trainingType.toLowerCase())
            : true;

          const matchesDate = filters.date
            ? training.date === filters.date
            : true;

          return matchesName && matchesType && matchesDate;
        });
      }      
}