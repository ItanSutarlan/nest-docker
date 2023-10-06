import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Types } from 'mongoose';
import { profileStub } from './stubs/profile.stub';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  const userId = new Types.ObjectId();
  const mockProfile = {
    _id: new Types.ObjectId(),
    ...profileStub(),
    horoscope: 'Virgo',
    zodiac: 'Pig',
    owner: userId,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        {
          provide: ProfileService,
          useValue: {
            findOne: async () => ({ ...mockProfile }),
            create: async () => ({ ...mockProfile }),
            update: async () => ({ ...mockProfile }),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get profile', () => {
    it('should get a profile', async () => {
      // Arrange
      const foundProfile = {
        ...mockProfile,
        horoscope: 'Virgo',
        zodiac: 'Pig',
        owner: userId,
      };
      jest.spyOn(profileService, 'findOne');

      // Action
      const result = await controller.get(userId);

      // Assert
      expect(result).toEqual(foundProfile);
      expect(profileService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('create profile', () => {
    it('should create a new profile', async () => {
      // Arrange
      const createdProfile = {
        ...mockProfile,
        horoscope: 'Virgo',
        zodiac: 'Pig',
        owner: userId,
      };
      jest.spyOn(profileService, 'create');

      // Action
      const result = await controller.create(userId, profileStub());

      // Assert
      expect(result).toEqual(createdProfile);
      expect(profileService.create).toHaveBeenCalledWith(userId, profileStub());
    });
  });

  describe('update profile', () => {
    it('should update profile correctly', async () => {
      // Arrange
      const updatedProfile = {
        ...mockProfile,
        horoscope: 'Virgo',
        zodiac: 'Pig',
        owner: userId,
      };
      jest.spyOn(profileService, 'update');

      // Action
      const result = await controller.update(userId, profileStub());

      // Assert
      expect(result).toEqual(updatedProfile);
      expect(profileService.update).toHaveBeenCalledWith(userId, profileStub());
    });
  });
});
