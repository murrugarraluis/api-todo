import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryParamsDto } from '../common/dto/query-params.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (e) {
      if (e.errno === 1062) {
        throw new BadRequestException(e.sqlMessage);
      }
      console.log(e);
      throw new InternalServerErrorException(`Oops! Error - Check logs server`);
    }
  }

  findAll(query: QueryParamsDto) {
    const options = {
      take: query.limit || 100,
      skip: query.offset || 0,
    };
    return this.usersRepository.find(options);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`${User.name} with id "${id}" not found.`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const userPre = await this.usersRepository.preload({
      ...user,
      ...updateUserDto,
    });
    return await this.usersRepository.save(userPre);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.usersRepository.softDelete(user.id);
  }
}
