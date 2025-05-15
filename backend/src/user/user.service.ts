import { DeleteCommand, GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { dbDocClient } from "src/database/dynamodb.service";
import { v4 as uuidv4 } from 'uuid'
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./create-user.dto";
import { JwtService } from "@nestjs/jwt";
import * as path from "path";
import { writeFile } from "fs/promises";

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

  async deleteUserById(userId: string) {
    const result = await dbDocClient.send(
      new DeleteCommand({
        TableName: 'Users',
        Key: { id: userId },
        ReturnValues: 'ALL_OLD'
      }),
    );

    return result.Attributes;
  }

  async uploadUsersPhoto(userId: string, base64Data: string) {
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      throw new BadRequestException({
        errorCode: 0,
        message: 'Invalid image data',
      });
    }

    const ext = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${uuidv4()}.${ext}`;
    const filePath = path.join(__dirname, '..', '..', 'uploads', 'photos', filename);

    await writeFile(filePath, buffer);

    const photoUrl = `${process.env.HOST_URL}/uploads/photos/${filename}`;

    await dbDocClient.send(
      new UpdateCommand({
        TableName: 'Users',
        Key: { id: userId },
        UpdateExpression: 'SET photo = :photo',
        ExpressionAttributeValues: {
          ':photo': photoUrl,
        },
      }),
    );

    return {
      message: 'Photo uploaded successfully',
      photoUrl,
    };
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    await dbDocClient.send(
      new UpdateCommand({
        TableName: 'Users',
        Key: { id: userId },
        UpdateExpression: 'SET #pwd = :password',
        ExpressionAttributeNames: {
          '#pwd': 'password'
        },
        ExpressionAttributeValues: {
          ':password': hashedPassword
        }
      }),
    );

    return { message: 'Password updated successfully' };
  }
}