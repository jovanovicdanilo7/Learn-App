import { Body, Controller, HttpCode, InternalServerErrorException, Post } from '@nestjs/common';

import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @HttpCode(201)
  async subscribe(@Body() body: { email: string }) {
    if (!body.email) {
      throw new InternalServerErrorException("Email is required");
    }

    return await this.subscriptionService.subscribe(body.email);
  }
}
