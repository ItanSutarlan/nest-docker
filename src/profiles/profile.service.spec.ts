import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { Profile } from './schemas/profile.schema';
import { getModelToken } from '@nestjs/mongoose';
import { profileStub } from './stubs/profile.stub';
import { Types } from 'mongoose';

const mockModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken(Profile.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne profile', () => {
    it('should find profile', async () => {
      // Arrange
      const horoscope = 'Virgo';
      const zodiac = 'Pig';
      const id = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const foundProfile = {
        ...profileStub(),
        horoscope,
        zodiac,
        _id: id,
        owner: userId,
      };
      mockModel.findOne.mockImplementationOnce(() =>
        Promise.resolve(foundProfile),
      );

      const result = await service.findOne(userId);

      expect(mockModel.findOne).toHaveBeenCalledWith({
        owner: userId,
      });
      expect(result).toEqual({
        _id: id,
        ...profileStub(),
        horoscope,
        zodiac,
        owner: userId,
      });
    });
  });

  describe('create profile', () => {
    it('should create a new profile', async () => {
      // Arrange
      const horoscope = 'Virgo';
      const zodiac = 'Pig';
      const id = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const createdProfile = {
        ...profileStub(),
        horoscope,
        zodiac,
        _id: id,
        owner: userId,
      };
      mockModel.create.mockImplementationOnce(() =>
        Promise.resolve(createdProfile),
      );

      const result = await service.create(userId, profileStub());

      expect(mockModel.create).toHaveBeenCalledWith({
        ...profileStub(),
        horoscope,
        zodiac,
        owner: userId,
      });
      expect(result).toEqual({
        _id: id,
        ...profileStub(),
        horoscope,
        zodiac,
        owner: userId,
      });
    });
  });

  describe('update', () => {
    it('should update an existing profile', async () => {
      // Arrange
      const horoscope = 'Virgo';
      const zodiac = 'Pig';
      const id = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const updatedProfile = {
        ...profileStub(),
        horoscope,
        zodiac,
        _id: id,
        owner: userId,
      };

      mockModel.findOneAndUpdate.mockResolvedValue(updatedProfile);

      const result = await service.update(userId, profileStub());

      expect(result).toEqual({
        _id: id,
        ...profileStub(),
        horoscope,
        zodiac,
        owner: userId,
      });
      expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
        { owner: userId },
        {
          ...profileStub(),
          horoscope,
          zodiac,
        },
        { new: true },
      );
    });
  });
});
