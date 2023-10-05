import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';

type ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signPayload(userId: ObjectId, email: string): { access_token: string } {
    const payload = {
      sub: userId,
      email,
    };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
