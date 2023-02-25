import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  done: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: number;
}
