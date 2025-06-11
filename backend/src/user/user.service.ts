import { DeleteCommand, GetCommand, QueryCommand, ScanCommand, UpdateCommand, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from 'uuid'
import { writeFile } from "fs/promises";
import * as bcrypt from 'bcryptjs';
import * as path from "path";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { dbDocClient } from "src/database/dynamodb.service";

const s3 = new S3Client({ region: 'eu-north-1' });

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async loginUser(body: { username: string, password: string }, isActive: boolean) {
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

    await dbDocClient.send(
      new UpdateCommand({
        TableName: "Users",
        Key: { id: user.id },
        UpdateExpression: "SET isActive = :isActive",
        ExpressionAttributeValues: {
          ":isActive": isActive,
        },
      })
    );

    const payload = { id: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }

  async setUserActiveStatus(userId: string, isActive: boolean) {
    await dbDocClient.send(
      new UpdateCommand({
        TableName: "Users",
        Key: { id: userId },
        UpdateExpression: "SET isActive = :isActive",
        ExpressionAttributeValues: {
          ":isActive": isActive,
        },
      })
    );
  }
}

export class UserService {
  async getUserMe(userId: string) {
    const result = await dbDocClient.send(
      new GetCommand({
        TableName: 'Users',
        Key: { id: userId }
      }),
    );

    return result.Item;
  }

  async deleteUserById(userId: string) {
    const userResult = await dbDocClient.send(
      new DeleteCommand({
        TableName: "Users",
        Key: { id: userId },
        ReturnValues: "ALL_OLD",
      })
    );

    const studentResult = await dbDocClient.send(
      new ScanCommand({
        TableName: "Students",
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );

    const student = studentResult.Items?.[0];
    if (student) {
      const studentId = student.id;

      await dbDocClient.send(
        new DeleteCommand({
          TableName: "Students",
          Key: { id: studentId },
        })
      );

      const relationScan = await dbDocClient.send(
        new ScanCommand({
          TableName: "TrainerToStudent",
        })
      );

      const relatedRelations = (relationScan.Items ?? []).filter(
        rel => rel.studentId === studentId
      );

      for (const relation of relatedRelations) {
        await dbDocClient.send(
          new DeleteCommand({
            TableName: "TrainerToStudent",
            Key: { id: relation.id },
          })
        );
      }

      const trainingScan = await dbDocClient.send(
        new ScanCommand({
          TableName: "Trainings",
        })
      );

      const studentTrainings = (trainingScan.Items ?? []).filter(
        training => training.studentId === studentId
      );

      for (const training of studentTrainings) {
        await dbDocClient.send(
          new DeleteCommand({
            TableName: "Trainings",
            Key: { id: training.id },
          })
        );
      }
    }

    return userResult.Attributes;
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

    const bucket = 'learn-app-user-photos-bucket';
    const key = `photos/${filename}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: `image/${ext}`,
      }),
    );

    const photoUrl = `https://${bucket}.s3.eu-north-1.amazonaws.com/${key}`;

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

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const userRes = await dbDocClient.send(
      new GetCommand({
        TableName: "Users",
        Key: { id: userId }
      })
    );

    const user = userRes.Item;
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException("Current password is incorrect.");
    }

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

    const userFields = ['firstName', 'lastName', 'email', 'username'];
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
      const trainerRes = await dbDocClient.send(
        new ScanCommand({
          TableName: "Trainers",
          FilterExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId
          }
        })
      );

      const trainer = trainerRes.Items?.[0];
      if (!trainer) {
        throw new BadRequestException("Trainer not found for this user.");
      }

      const trainerUpdates = { specializationId: updateData.specializationId };
      const expr = this.buildUpdateExpression(trainerUpdates);

      updatePromises.push(
        dbDocClient.send(
          new UpdateCommand({
            TableName: "Trainers",
            Key: { id: trainer.id },
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

  async getAllUsers() {
    const result = await dbDocClient.send(
      new ScanCommand({
        TableName: "Users",
      })
    );
    return result.Items || [];
  }

  async getUserById(id: string) {
    const result = await dbDocClient.send(
      new GetCommand({
        TableName: 'Users',
        Key: { id: id }
      }),
    );

    return result.Item;
  }

  async removeUsersPhoto(userId: string) {
    const userResult = await dbDocClient.send(
      new GetCommand({
        TableName: 'Users',
        Key: { id: userId },
      })
    );

    const photoUrl = userResult.Item?.photo;
    if (photoUrl) {
      const match = photoUrl.match(/\.com\/(.+)$/);
      const key = match?.[1];

      if (key) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: 'learn-app-user-photos-bucket',
            Key: key,
          })
        );
      }
    }

    await dbDocClient.send(
      new UpdateCommand({
        TableName: 'Users',
        Key: { id: userId },
        UpdateExpression: 'REMOVE photo',
      })
    );

    return {
      message: 'Photo removed successfully',
    };
  }
}