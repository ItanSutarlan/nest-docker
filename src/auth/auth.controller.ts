import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '../users/user.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthEntity } from './constants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@UseGuards(ThrottlerGuard)
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthEntity> {
    const { _id: id, email } = await this.userService.create(registerDto);
    return this.authService.signPayload(id, email);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthEntity> {
    const { _id: id, email } = await this.userService.verify(loginDto);
    return this.authService.signPayload(id, email);
  }
}
