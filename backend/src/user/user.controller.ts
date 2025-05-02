import { Body, Post, Controller, Get, UseGuards, Req, HttpCode, Delete } from "@nestjs/common";
import { AuthService, UserService } from "./user.service";
import { CreateUserDto } from "./create-user.dto";
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from "src/auth/get-user.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() body: { email: string, password: string }) {
        return this.authService.login(body);
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

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async getMe(@GetUser() user: { id: string, email: string }) {
        return this.userService.getUserById(user.id)
    }

    @Delete('me')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(204)
    async deleteMe(@GetUser() user: { id: string, email: string }) {
        return this.userService.deleteUserById(user.id);
    }
}