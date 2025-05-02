import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { dbDocClient } from "src/database/dynamodb.service";
import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./create-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    async register(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
        const user = {
            id: uuidv4(),
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            username: createUserDto.username,
            email: createUserDto.email,
            password: hashedPassword,
            photo: createUserDto.photo ?? null,
            isActive: true,
          };

        await dbDocClient.send(
            new PutCommand({
                TableName: 'Users',
                Item: user
            }),
        );

        return {
            user,
        };
    }

    async login(body: { email: string, password: string }) {
        const { email, password } = body;

        const result = await dbDocClient.send(
            new ScanCommand({
              TableName: 'Users',
              FilterExpression: 'email = :email',
              ExpressionAttributeValues: {
                ':email': email,
              },
            }),
          );
          
        const user = result.Items?.[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException({
                errorCode: 0,
                message: 'Invalid credentials',
              });
        }

        const payload = { id: user.id, email: user.email };
        const token = this.jwtService.sign(payload);
    
        return {
            token,
            user,
        };
    }
}

export class UserService {
  async getUserById(userId: string) {
    const result = await dbDocClient.send(
      new GetCommand({
        TableName: 'Users',
        Key: { id: userId }
      }),
    );

    return result.Item;
  }
}