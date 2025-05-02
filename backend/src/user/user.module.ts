import { Module } from "@nestjs/common";
import { AuthController, UserController } from "./user.controller";
import { AuthService, UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/auth/jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
      ],
    controllers: [AuthController, UserController],
    providers: [AuthService, UserService, JwtStrategy]
})
export class UserModule {}