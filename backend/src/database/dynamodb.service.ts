import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";


export const dbClient = new DynamoDBClient({
    region: process.env.REGION,
});

export const dbDocClient = DynamoDBDocumentClient.from(dbClient);