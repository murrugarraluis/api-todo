import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryParamsDto } from '../common/dto/query-params.dto';
import { UsersService } from '../users/users.service';
import { QueryTaskParamsDto } from './dto/query-task-params.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const user = await this.userService.findOne(createTaskDto.userId);
    const task = await this.taskRepository.create({
      ...createTaskDto,
      user: user,
    });
    return await this.taskRepository.save(task);
  }

  findAll(query: QueryTaskParamsDto) {
    const options = {
      take: query.limit || 100,
      skip: query.offset || 0,
      relations: {
        user: true,
      },
      where: {},
    };
    if (query.userId) {
      options.where = { user: { id: query.userId } };
    }
    return this.taskRepository.find(options);
  }

  async findOne(id: number) {
    const options = {
      where: { id },
      relations: {
        user: true,
      },
    };
    const task = await this.taskRepository.findOne(options);
    if (!task) {
      throw new NotFoundException(`${Task.name} with id "${id}" not found.`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    if (updateTaskDto.userId)
      task.user = await this.userService.findOne(updateTaskDto.userId);

    const taskPre = await this.taskRepository.preload({
      ...task,
      ...updateTaskDto,
    });
    return await this.taskRepository.save(taskPre);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.taskRepository.softDelete(id);
    return task;
  }
}
