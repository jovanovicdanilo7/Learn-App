import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from "@nestjs/common";
import { dbDocClient } from "src/database/dynamodb.service";

@Injectable()
export class SpecializationsService {
    async getAll() {
        const result = await dbDocClient.send(
            new ScanCommand({
                TableName: 'Specializations'
            })
        );
        return result.Items?.map(item => unmarshall(item));
    }
}