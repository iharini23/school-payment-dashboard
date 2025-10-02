import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  create(dto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(dto);
  }

  findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).select('+password').exec();
  }

  async ensureSeedUser(defaultUser?: CreateUserDto) {
    if (!defaultUser) {
      return;
    }

    const existing = await this.userModel.findOne({ username: defaultUser.username }).exec();

    if (!existing) {
      await this.create(defaultUser);
    }
  }
}
