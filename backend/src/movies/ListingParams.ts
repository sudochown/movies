import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SortDirection } from './types';

export class Pagination {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class Sorting {
  @IsOptional()
  @Type(() => String)
  @IsString()
  sort_field?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  sort_direction?: 'asc' | 'desc';
}

export type QueryParams = { [filter: string]: string } & Pagination & Sorting;
