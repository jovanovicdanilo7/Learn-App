import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Injectable } from "@nestjs/common";
import { dbDocClient } from "src/database/dynamodb.service";
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UserService {
    async register(body: any) {
        const user = {
            id: uuidv4(),
            firstName: body.firstName,
            lastName: body.lastName,
            username: body.username,
            email: body.email,
            password: body.password,
            photo: body.photo ?? null,
            isActive: true,
          };

        await dbDocClient.send(
            new PutCommand({
                TableName: 'Users',
                Item: user
            }),
        );
        return {
            message: 'User registered successfully',
            user: body
        }
    }
}