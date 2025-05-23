import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dbDocClient } from 'src/database/dynamodb.service';

@Injectable()
export class TrainerToStudentService {
  async create(dto: { trainerId: string; studentId: string }) {
    const newEntry = {
      id: uuidv4(),
      trainerId: dto.trainerId,
      studentId: dto.studentId,
    };

    await dbDocClient.send(
      new PutCommand({
        TableName: 'TrainerToStudent',
        Item: newEntry,
      })
    );

    return newEntry;
  }

  async getAll() {
    const result = await dbDocClient.send(
      new ScanCommand({
        TableName: 'TrainerToStudent',
      })
    );

    return result.Items || [];
  }
}
