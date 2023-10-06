import { Body, Controller, Post, Put, Get, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { JwtGuard } from '../auth/guards';
import { User } from '../auth/decorators';
import { Types } from 'mongoose';
import { ProfileEntity } from './constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Profiles')
@UseGuards(JwtGuard)
@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  get(@User('id') userId: Types.ObjectId): Promise<ProfileEntity> {
    return this.profileService.findOne(userId);
  }

  @Post()
  create(
    @User('id') userId: Types.ObjectId,
    @Body() profileDto: CreateProfileDto,
  ): Promise<ProfileEntity> {
    return this.profileService.create(userId, profileDto);
  }

  @Put()
  update(
    @User('id') userId: Types.ObjectId,
    @Body() profileDto: UpdateProfileDto,
  ): Promise<ProfileEntity> {
    return this.profileService.update(userId, profileDto);
  }
}
