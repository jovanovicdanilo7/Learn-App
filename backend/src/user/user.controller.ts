import { Body, Post, Controller, Get, UseGuards, HttpCode, Delete, Put, Res } from "@nestjs/common";
import { AuthService, UserService } from "./user.service";
import { CreateUserDto } from "./create-user.dto";
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from "src/auth/get-user.decorator";
import { Response } from "express";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async login(
        @Body() body: { username: string, password: string },
        @Res({ passthrough: true }) response: Response
    ) {
        const { user, token } = await this.authService.login(body);

        response.cookie('token', token, {
            httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
        });

        return { user };
    }

    @Get('logout')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token');
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
        return await this.userService.getUserById(user.id)
    }

    @Delete('me')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(204)
    async deleteMe(@GetUser() user: { id: string, email: string }) {
        return await this.userService.deleteUserById(user.id);
    }

    @Post('upload-photo')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async uploadPhoto(
        @GetUser() user: { id: string, email: string },
        @Body() body: { data: string }
    ) {
        return await this.userService.uploadUsersPhoto(user.id, body.data);
    }

    @Put('update-password')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async changePassword(
        @GetUser() user: { id: string, email: string },
        @Body() body: { newPassword: string }
    ) {
        return await this.userService.updatePassword(user.id, body.newPassword);
    }
}