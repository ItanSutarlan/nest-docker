import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from '../auth/dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    const user = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    delete createdUser.password;

    return createdUser;
  }

  async verify(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto;
    const user = await this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  findById(userId) {
    return this.userModel.findById(userId);
  }
}
