import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { dbDocClient } from "src/database/dynamodb.service";

@Injectable()
export class StudentService {
  constructor(private jwtService: JwtService) {}

  async createStudent(dto: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    address?: string;
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
    const studentId = uuidv4();

    const username = `${dto.firstName}.${dto.lastName}`.toLowerCase();
    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = {
      id: userId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      username,
      email: dto.email,
      password: hashedPassword,
      isActive: true,
      photo: null
    };

    const student = {
      id: studentId,
      userId,
      dateOfBirth: dto.dateOfBirth || '',
      address: dto.address || '',
    };

    await dbDocClient.send(new PutCommand({ TableName: "Users", Item: user }));
    await dbDocClient.send(new PutCommand({ TableName: "Students", Item: student }));

    const token = this.jwtService.sign({ id: userId, username });

    return {
      credentials: { username, password: plainPassword },
      token,
    };
  }

  async getAllStudents() {
    const result = await dbDocClient.send(
      new ScanCommand({
        TableName: "Students",
      })
    );

    return result.Items || [];
  }

  async getStudentByUserId(userId: string) {
    const result = await dbDocClient.send(
      new ScanCommand({
        TableName: "Students",
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      throw new NotFoundException(`Student with userId ${userId} not found.`);
    }

    return result.Items[0];
  }

  async updateStudent(id: string, dto: { dateOfBirth?: string; address?: string }) {
    const updateFields = Object.entries(dto)
      .filter(([_, value]) => value !== undefined)
      .map(([key]) => `${key} = :${key}`)
      .join(", ");

    const expressionAttributeValues = Object.entries(dto).reduce((acc, [key, value]) => {
      acc[`:${key}`] = value;
      return acc;
    }, {} as Record<string, any>);

    const result = await dbDocClient.send(
      new UpdateCommand({
        TableName: "Students",
        Key: { id },
        UpdateExpression: `SET ${updateFields}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );

    return result.Attributes;
  }

  async getStudentById(id: string) {
    const result = await dbDocClient.send(
      new GetCommand({
        TableName: 'Students',
        Key: { id: id }
      }),
    );

    return result.Item;
  }
}
