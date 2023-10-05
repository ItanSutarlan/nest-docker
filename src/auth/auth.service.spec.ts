import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import mongoose from 'mongoose';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockedToken'), // Mock the sign method of JwtService
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signPayload', () => {
    it('should sign a payload and return an access token', () => {
      const userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();
      const email = 'john@gmail.com';

      const expectedToken = 'mockedToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(expectedToken);

      const result = authService.signPayload(userId, email);

      expect(result).toEqual({ access_token: expectedToken });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: userId, email });
    });
  });
});
