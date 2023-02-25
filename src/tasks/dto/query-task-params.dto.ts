import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
export class QueryTaskParamsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  limit: number;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  offset: number;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  userId: number;
}
