import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

import { dbDocClient } from '../database/dynamodb.service';

@Injectable()
export class SubscriptionService {
  async subscribe(email: string) {
    try {
      await dbDocClient.send(
        new PutCommand({
          TableName: "Subscriptions",
          Item: {
            email,
            subscribedAt: new Date().toISOString(),
          },
          ConditionExpression: "attribute_not_exists(email)",
        })
      );

      return { success: true, message: "Subscription successful" };
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        throw new BadRequestException("This email is already subscribed");
      }
      console.error("Subscription error:", error);
      throw new InternalServerErrorException("Something went wrong during subscription");
    }
  }
}
