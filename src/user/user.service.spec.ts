import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { userStub } from './stubs/user.stub';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;
  const id = new mongoose.Types.ObjectId();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
            findOne: jest.fn(),
            create: async () => ({
              _id: id,
              ...userStub(),
              password: 'hashedPassword',
            }),
          },
        },
      ],
    }).compile();
    model = module.get<Model<User>>(getModelToken(User.name));
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create method', () => {
    it('should throw error when user is already exist', async () => {
      // Arrange
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(userStub());

      // Action & Assert
      await expect(service.create(userStub())).rejects.toThrow(
        UnauthorizedException,
      );
      expect(model.findOne).toHaveBeenCalledWith({
        $or: [{ username: userStub().username }, { email: userStub().email }],
      });
    });

    it('should create new user correctly', async () => {
      // Arrange
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(async () => 'hashedPassword');

      jest.spyOn(model, 'create');

      // Action
      const user = await service.create(userStub());

      // Assert
      expect(model.findOne).toHaveBeenCalledWith({
        $or: [{ username: userStub().username }, { email: userStub().email }],
      });
      expect(model.create).toHaveBeenCalledWith({
        ...userStub(),
        password: 'hashedPassword',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userStub().password, 10);
      expect(user).toStrictEqual({
        _id: id,
        username: userStub().username,
        email: userStub().email,
      });
    });
  });

  describe('verify method', () => {
    it('should throw error when invalid email or username', async () => {
      // Arrange
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      // Action & Assert
      await expect(
        service.verify({
          usernameOrEmail: userStub().email,
          password: userStub().password,
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(model.findOne).toHaveBeenCalledWith({
        $or: [{ username: userStub().email }, { email: userStub().email }],
      });
    });

    it('should throw Error when invalid password', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword';
      jest.spyOn(model, 'findOne').mockResolvedValueOnce({
        ...userStub(),
        _id: id,
        password: hashedPassword,
      });
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false);

      // Action & Assert
      await expect(
        service.verify({
          usernameOrEmail: userStub().username,
          password: userStub().password,
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(model.findOne).toHaveBeenCalledWith({
        $or: [
          { username: userStub().username },
          { email: userStub().username },
        ],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userStub().password,
        hashedPassword,
      );
    });

    it('should return user correctly', async () => {
      // Arrange
      const hashPassword = 'hashedPassword';
      jest.spyOn(model, 'findOne').mockResolvedValueOnce({
        ...userStub(),
        _id: id,
        password: hashPassword,
      });

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => true);

      // Action
      const user = await service.verify({
        usernameOrEmail: userStub().email,
        password: userStub().password,
      });

      // Assert
      expect(model.findOne).toHaveBeenCalledWith({
        $or: [{ username: userStub().email }, { email: userStub().email }],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userStub().password,
        hashPassword,
      );
      expect(user).toStrictEqual({
        _id: id,
        username: userStub().username,
        email: userStub().email,
      });
    });
  });

  describe('findById method', () => {
    it('should return promise null when user unavailable', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      await expect(service.findById(id)).resolves.toBeNull();
      expect(model.findById).toHaveBeenCalledWith(id);
    });
  });
});
