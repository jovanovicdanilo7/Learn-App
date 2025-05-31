import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from "@nestjs/common";

import { dbDocClient } from "src/database/dynamodb.service";

@Injectable()
export class TrainingTypeService {
  async getAllTrainingTypes() {
    const result = await dbDocClient.send(
      new ScanCommand({
        TableName: 'TrainingTypes'
      })
    );

    return result.Items?.map(item => unmarshall(item));
  }
}