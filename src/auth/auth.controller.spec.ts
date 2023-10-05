import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userStub } from '../user/stubs/user.stub';
import { Types } from 'mongoose';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  const mockUser = { _id: new Types.ObjectId(), ...userStub() };
  delete mockUser.password;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signPayload: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            create: async () => mockUser,
            verify: async () => mockUser,
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call register method correctly', async () => {
      // Arrange
      const registerDto: RegisterDto = userStub();
      const userId = mockUser._id;
      const email = mockUser.email;

      jest.spyOn(userService, 'create');
      jest
        .spyOn(authService, 'signPayload')
        .mockImplementationOnce(() => ({ access_token: 'token' }));

      // Action
      const result = await authController.register(registerDto);

      // Assert
      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(authService.signPayload).toHaveBeenCalledWith(userId, email);
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('login', () => {
    it('should call AuthService login method correctly', async () => {
      // Arrange
      const userId = mockUser._id;
      const email = mockUser.email;
      const loginDto: LoginDto = {
        usernameOrEmail: userStub().email,
        password: userStub().password,
      };
      jest.spyOn(userService, 'verify');
      jest
        .spyOn(authService, 'signPayload')
        .mockImplementationOnce(() => ({ access_token: 'token' }));

      // Action
      const result = await authController.login(loginDto);

      // Assert
      expect(userService.verify).toHaveBeenCalledWith(loginDto);
      expect(authService.signPayload).toHaveBeenCalledWith(userId, email);
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
