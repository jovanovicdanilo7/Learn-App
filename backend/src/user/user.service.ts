import { DeleteCommand, GetCommand, PutCommand, ScanCommand, UpdateCommand, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import { BadRequestException, Injectable } from "@nestjs/common";
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

    async login(body: { username: string, password: string }) {
        const { username, password } = body;

        const result = await dbDocClient.send(
            new ScanCommand({
              TableName: 'Users',
              FilterExpression: 'username = :username',
              ExpressionAttributeValues: {
                ':username': username,
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

        const payload = { id: user.id, username: user.username };
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

  async updateUser(userId: string, updateData: any) {
    const updatePromises: Promise<UpdateCommandOutput>[] = [];
  
    const userFields = ['firstName', 'lastName', 'email', 'username', 'isActive'];
    const userUpdates = this.extractFields(updateData, userFields);
  
    if (Object.keys(userUpdates).length > 0) {
      const expr = this.buildUpdateExpression(userUpdates);
      updatePromises.push(
        dbDocClient.send(
          new UpdateCommand({
            TableName: 'Users',
            Key: { id: userId },
            ...expr
          })
        )
      );
    }
  
    if ('dateOfBirth' in updateData || 'address' in updateData) {
      const studentFields = ['dateOfBirth', 'address'];
      const studentUpdates = this.extractFields(updateData, studentFields);
      const expr = this.buildUpdateExpression(studentUpdates);
  
      updatePromises.push(
        dbDocClient.send(
          new UpdateCommand({
            TableName: 'Students',
            Key: { id: userId },
            ...expr
          })
        )
      );
    }
  
    if ('specializationId' in updateData) {
      const trainerUpdates = { specializationId: updateData.specializationId };
      const expr = this.buildUpdateExpression(trainerUpdates);
  
      updatePromises.push(
        dbDocClient.send(
          new UpdateCommand({
            TableName: 'Trainers',
            Key: { id: userId },
            ...expr
          })
        )
      );
    }
  
    await Promise.all(updatePromises);
  
    return { message: 'User data updated successfully' };
  }

private extractFields(source: any, keys: string[]) {
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => keys.includes(key))
  );
}

private buildUpdateExpression(values: Record<string, any>) {
  const setExpressions: string[] = [];
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, any> = {};

  Object.entries(values).forEach(([key, val], index) => {
    const name = `#key${index}`;
    const value = `:val${index}`;
    setExpressions.push(`${name} = ${value}`);
    ExpressionAttributeNames[name] = key;
    ExpressionAttributeValues[value] = val;
  });

  return {
    UpdateExpression: `SET ${setExpressions.join(', ')}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
}

}