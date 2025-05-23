import { BadRequestException, Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { dbDocClient } from "src/database/dynamodb.service";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class StudentService {
  constructor(private jwtService: JwtService) {}

  async create(dto: {
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
}
