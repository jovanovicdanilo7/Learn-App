import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { dbDocClient } from "src/database/dynamodb.service";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

@Injectable()
export class StudentService {
  async create(dto: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    address?: string;
  }) {
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

    await dbDocClient.send(
      new PutCommand({
        TableName: "Users",
        Item: user
      })
    );

    await dbDocClient.send(
      new PutCommand({
        TableName: "Students",
        Item: student
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
