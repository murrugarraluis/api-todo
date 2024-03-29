import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user: User = await this.validUser(email, password);
    return this.generateAccessToken(user);
  }
  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return this.generateAccessToken(user);
  }
  generateAccessToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: this.jwtService.sign(payload),
    };
  }
  async validUser(email, password): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials.');
    return user;
  }
}
