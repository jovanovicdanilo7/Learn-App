import { Body, Post, Controller, Get, UseGuards, HttpCode, Delete, Put, Res, Param, InternalServerErrorException } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Response } from "express";

import { AuthService, UserService } from "./user.service";
import { GetUser } from "src/auth/get-user.decorator";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: { username: string, password: string },
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const { user, token } = await this.authService.loginUser(body, true);

      response.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      return { user };
    } catch (error) {
      console.error("Failed to login user:", error);
      throw new InternalServerErrorException("Could not login user");
    }
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard("jwt"))
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: { id: string }
  ) {
    try {
      await this.authService.setUserActiveStatus(user.id, false);

      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      return { message: 'Logout successful' };
    } catch (error) {
      console.error("Failed to logout user:", error);
      throw new InternalServerErrorException("Could not logout user");
    }
  }
}

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getMe(@GetUser() user: { id: string, email: string }) {
    try {
      return await this.userService.getUserMe(user.id)
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw new InternalServerErrorException("Could not fetch user");
    }
  }

  @Delete('me')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  async delete(@GetUser() user: { id: string, email: string }) {
    try {
      return await this.userService.deleteUserById(user.id);
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw new InternalServerErrorException("Could not delete user");
    }
  }

  @Post('upload-photo')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async uptadePhoto(
      @GetUser() user: { id: string, email: string },
      @Body() body: { data: string }
  ) {
    try {
      return await this.userService.uploadUsersPhoto(user.id, body.data);
    } catch (error) {
      console.error("Failed to update user photo:", error);
      throw new InternalServerErrorException("Could not update user photo");
    }
  }

  @Put('update-password')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @GetUser() user: { id: string, email: string },
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    try {
      return await this.userService.updatePassword(user.id, body.currentPassword, body.newPassword);
    } catch (error) {
        console.error("Failed to update user password:", error);
        throw new InternalServerErrorException("Could not update user password");
    }
  }

  @Put(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Param('id') userId: string, @Body() updateData: any) {
    try {
      return this.userService.updateUser(userId, updateData);
    } catch (error) {
      console.error("Failed to update user data:", error);
      throw new InternalServerErrorException("Could not update user data");
    }
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw new InternalServerErrorException("Could not fetch users");
    }
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async getById(@Param('id') id: string) {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      console.error("Failed to fetch user by id:", error);
      throw new InternalServerErrorException("Could not retrieve user by id");
    }
  }

  @Delete('remove-photo')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async removePhoto(
    @GetUser() user: { id: string; email: string }
  ) {
    try {
      return await this.userService.removeUsersPhoto(user.id);
    } catch (error) {
      console.error("Failed to remove user photo:", error);
      throw new InternalServerErrorException("Could not remove user photo");
    }
  }
}