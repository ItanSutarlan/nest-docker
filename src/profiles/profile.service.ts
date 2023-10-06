import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Horoscope,
  Profile,
  ProfileDocument,
  Zodiac,
} from './schemas/profile.schema';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  findOne(userId: Types.ObjectId) {
    return this.profileModel.findOne({ owner: userId });
  }

  async create(userId: Types.ObjectId, profileDto: CreateProfileDto) {
    const horoscope: Horoscope = this.calculateHoroscope(profileDto.birthday);
    const zodiac: Zodiac = this.calculateZodiac(profileDto.birthday);

    const profile = await this.profileModel.create({
      ...profileDto,
      horoscope,
      zodiac,
      owner: userId,
    });

    return profile;
  }

  async update(userId: Types.ObjectId, profileDto: UpdateProfileDto) {
    let payload = profileDto;

    if (payload.birthday) {
      const horoscope: Horoscope = this.calculateHoroscope(profileDto.birthday);
      const zodiac: Zodiac = this.calculateZodiac(profileDto.birthday);
      payload = Object.assign({ zodiac, horoscope }, payload);
    }

    const profile = await this.profileModel.findOneAndUpdate(
      {
        owner: userId,
      },
      payload,
      { new: true },
    );

    return profile;
  }

  calculateHoroscope(date: Date): Horoscope {
    const horoscopeSigns: string[] = [
      'Aquarius',
      'Pisces',
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
    ];
    const cutoffDates: number[] = [
      20, 19, 20, 20, 21, 21, 22, 23, 23, 22, 21, 22,
    ];

    const day: number = date.getDate();
    const monthIndex: number = date.getMonth();

    const index: number =
      day >= cutoffDates[monthIndex] ? monthIndex : (monthIndex - 1 + 12) % 12;

    const horoscope = horoscopeSigns[index];
    return Horoscope[horoscope];
  }

  calculateZodiac(date: Date): Zodiac {
    const zodiacSigns: string[] = [
      'Rat',
      'Ox',
      'Tiger',
      'Rabbit',
      'Dragon',
      'Snake',
      'Horse',
      'Sheep',
      'Monkey',
      'Rooster',
      'Dog',
      'Pig',
    ];
    const year: number = date.getFullYear();

    const index: number = (year - 1900) % 12;

    const zodiac = zodiacSigns[index];
    return Zodiac[zodiac];
  }
}
