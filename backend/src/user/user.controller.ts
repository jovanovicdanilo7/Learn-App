import { Body, Post, Controller, Get, UseGuards, Req, HttpCode } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./create-user.dto";
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() body: { email: string, password: string }) {
        return this.userService.login(body);
    }

    @Get('logout')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    logout() {
        return {
            message: 'Logout successful',
        };
    }
}