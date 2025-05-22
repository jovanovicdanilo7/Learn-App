import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from 'bcrypt';
import { dbDocClient } from "src/database/dynamodb.service";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

@Injectable()
export class TrainerService {
  async create(dto: {
    firstName: string;
    lastName: string;
    email: string;
    specializationId: string;
  }) {
    const userId = uuidv4();
    const trainerId = uuidv4();

    const username = `${dto.firstName}.${dto.lastName}`.toLowerCase();
    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newUser = {
      id: userId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      username,
      email: dto.email,
      password: hashedPassword,
      isActive: true,
      photo: null
    };

    const newTrainer = {
      id: trainerId,
      userId,
      specializationId: dto.specializationId,
    };

    await dbDocClient.send(
      new PutCommand({
        TableName: "Users",
        Item: newUser,
      })
    );

    await dbDocClient.send(
      new PutCommand({
        TableName: "Trainers",
        Item: newTrainer,
      })
    );

    return {
      credentials: {
        username,
        password: plainPassword
      }
    };
  }
}
