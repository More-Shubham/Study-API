import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto[]) {
    return this.userModel.create(...createUserDto);
  }

  findAll() {
    return this.userModel.find({});
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: updateUserDto },
    );
  }

  remove(id: string) {
    return this.userModel.findOneAndDelete({ _id: id });
  }
}
