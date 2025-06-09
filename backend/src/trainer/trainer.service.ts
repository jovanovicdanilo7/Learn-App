import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from 'bcryptjs';

import { dbDocClient } from "src/database/dynamodb.service";

@Injectable()
export class TrainerService {
  constructor(private jwtService: JwtService) {}

  async createTrainer(dto: {
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
  }) {
    const existingUser = await dbDocClient.send(
      new ScanCommand({
        TableName: "Users",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": dto.email,
        },
      })
    );

    if (existingUser.Items && existingUser.Items.length > 0) {
      throw new BadRequestException("A user with this email already exists.");
    }

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
      specializationId: dto.specialization,
    };

    await dbDocClient.send(new PutCommand({ TableName: "Users", Item: newUser }));
    await dbDocClient.send(new PutCommand({ TableName: "Trainers", Item: newTrainer }));

    const token = this.jwtService.sign({ id: userId, username });

    return {
      credentials: { username, password: plainPassword },
      token,
    };
  }

  async getAllTrainers() {
    const result = await dbDocClient.send(
      new ScanCommand({
        TableName: "Trainers",
      })
    );

    return result.Items || [];
  }

  async getTrainerByUserId(userId: string) {
    const result = await dbDocClient.send(
      new ScanCommand({
        TableName: "Trainers",
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      throw new NotFoundException(`Trainer with userId ${userId} not found.`);
    }

    return result.Items[0];
  }

async updateTrainerSpecializationByUserId(userId: string, specializationId: string) {
    const queryResult = await dbDocClient.send(
      new QueryCommand({
        TableName: "Trainers",
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );

    const trainer = queryResult.Items?.[0];

    if (!trainer) {
      throw new NotFoundException("Trainer not found for given userId");
    }

    const updateResult = await dbDocClient.send(
      new UpdateCommand({
        TableName: "Trainers",
        Key: { id: trainer.id },
        UpdateExpression: "SET specializationId = :sid",
        ExpressionAttributeValues: {
          ":sid": specializationId,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return updateResult.Attributes;
  }

  async getTrainerById(id: string) {
    const result = await dbDocClient.send(
      new GetCommand({
        TableName: 'Trainers',
        Key: { id: id }
      }),
    );

    return result.Item;
  }
}
