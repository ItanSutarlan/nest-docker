import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '../user/user.service';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ access_token: string }> {
    const { _id: id, email } = await this.userService.create(registerDto);
    return this.authService.signPayload(id, email);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const { _id: id, email } = await this.userService.verify(loginDto);
    return this.authService.signPayload(id, email);
  }
}
