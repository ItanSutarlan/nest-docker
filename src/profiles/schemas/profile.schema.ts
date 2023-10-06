import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum Horoscope {
  Aries = 'Aries',
  Taurus = 'Taurus',
  Gemini = 'Gemini',
  Cancer = 'Cancer',
  Leo = 'Leo',
  Virgo = 'Virgo',
  Libra = 'Libra',
  Scorpio = 'Scorpio',
  Sagittarius = 'Sagittarius',
  Capricorn = 'Capricorn',
  Aquarius = 'Aquarius',
  Pisces = 'Pisces',
}

export enum Zodiac {
  Rat = 'Rat',
  Ox = 'Ox',
  Tiger = 'Tiger',
  Rabbit = 'Rabbit',
  Dragon = 'Dragon',
  Snake = 'Snake',
  Horse = 'Horse',
  Sheep = 'Sheep',
  Monkey = 'Monkey',
  Rooster = 'Rooster',
  Dog = 'Dog',
  Pig = 'Pig',
}

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ versionKey: false, timestamps: true })
export class Profile {
  _id: string;

  @Prop({ required: true, minlength: 2, maxlength: 100 })
  fullName: string;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ type: Date, required: true })
  birthday: Date;

  @Prop({ required: true, enum: Object.values(Horoscope) })
  horoscope: string;

  @Prop({ required: true, enum: Object.values(Zodiac) })
  zodiac: string;

  @Prop({ required: true, min: 0, max: 300 })
  height: number;

  @Prop({ required: true, min: 0, max: 500 })
  weight: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
