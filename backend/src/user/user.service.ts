import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    async register(body: any) {
        return {
            message: 'User registered successfully',
            user: body
        }
    }
}