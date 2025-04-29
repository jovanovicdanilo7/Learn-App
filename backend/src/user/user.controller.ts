import { Body, Post, Controller } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./create-user.dto";

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.register(createUserDto);
    }
}