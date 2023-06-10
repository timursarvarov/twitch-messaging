;
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';

import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';


import { UserForRegistrationRequestDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async findAll() {
    const users = await this.userRepository.find();

    return users;
  }

  async findOne(_id: string) {
    console.log("id should be here", _id)
    const user = await this.userRepository.findOneBy({ _id: new ObjectId(_id) });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${_id}`);
    }

    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne(
      {
        where: {
          username: username
        }
      }
    );

    return user;
  }

  async create(createUserDto: UserForRegistrationRequestDto): Promise<User> {
    const user = await this.userRepository.create({
      ...createUserDto,
    });

    return this.userRepository.save(user);
  }

}
