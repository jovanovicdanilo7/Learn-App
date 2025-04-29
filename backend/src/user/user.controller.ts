import { Body, Post, Controller } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() body: any) {
        return this.userService.register(body);
    }
}