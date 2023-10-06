import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsDate,
} from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(300)
  height: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(500)
  weight: number;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
