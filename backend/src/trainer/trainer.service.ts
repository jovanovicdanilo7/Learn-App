import { BadRequestException, Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from 'bcrypt';
import { dbDocClient } from "src/database/dynamodb.service";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { specializations } from "src/seeds/seed-specialization";

@Injectable()
export class TrainerService {
  async create(dto: {
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

    const matchedSpecialization = specializations.find(
      (spec) => spec.specialization === dto.specialization
    );

    if (!matchedSpecialization) {
      throw new BadRequestException(`Specialization "${dto.specialization}" not found`);
    }

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
      specializationId: matchedSpecialization.id,
    };

    await dbDocClient.send(new PutCommand({ TableName: "Users", Item: newUser }));
    await dbDocClient.send(new PutCommand({ TableName: "Trainers", Item: newTrainer }));

    return {
      credentials: {
        username,
        password: plainPassword
      }
    };
  }
}
