import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { Login } from './interfaces/login.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async exists(userData: LoginInput): Promise<User> {
    return this.userService.findByEmail(userData.email);
  }

  public async login(input: LoginInput): Promise<Login> {
    const user = await this.exists(input);

    if (!user) {
      return { status: 404, auth: null };
    }

    const validPassword = user.comparePassword(input.password);

    if (!validPassword) {
      return { status: 403, auth: null };
    }

    const payload = `${user.id}`;
    const accessToken = this.jwtService.sign(payload);

    return {
      status: 200,
      auth: {
        expiresIn: 3600,
        token: accessToken,
        userId: payload,
      },
    };
  }

  public async register(input: RegisterInput): Promise<User> {
    return this.userService.create(input);
  }
}
