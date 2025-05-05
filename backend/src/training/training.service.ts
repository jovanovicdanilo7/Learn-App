import { dbDocClient } from "src/database/dynamodb.service";
import { CreateTrainingDto } from "./create-training.dto";
import { v4 as uuidv4 } from 'uuid'
import { PutCommand } from "@aws-sdk/lib-dynamodb";

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
}