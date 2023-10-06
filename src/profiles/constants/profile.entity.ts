export class ProfileEntity {
  _id: string;
  fullName: string;
  gender: string;
  birthday: Date;
  horoscope: string;
  zodiac: string;
  height: number;
  weight: number;
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
}
