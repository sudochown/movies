import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDTO } from "./movie.dto";
import { Movie } from "./movie.entity";
import { QueryListParams } from "../types";
import { ObjectLiteral } from "typeorm/common/ObjectLiteral";

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService){}
  
  @Get()
  index(
      @Query()
      queryParams: QueryListParams<Omit<MovieDTO, '_id'>>
  ): Promise<{ items: Movie[]; total: number; aggregation: ObjectLiteral }> {
    const { page, limit, sort_direction, sort_field, ...filters } = queryParams;

    Object.keys(filters).map((field) => {
      if (!filters[field]) {
        delete filters[field];
        return;
      }

      filters[field] = { $in: String(filters[field]).split(',') }
    });
  
    return this.movieService.findAll(
      page,
      limit,
      Object.keys(filters).length ? filters : undefined,
      sort_field ? {[sort_field]: sort_direction} : undefined
    );
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Movie | null> {
    return this.movieService.findById(id);
  }

  @Post('create')
  async create(@Body() movieDto: MovieDTO): Promise<Movie> {
    return this.movieService.create(movieDto);
  }
  
  @Put(':id/update')
  async update(@Param('id') id, @Body() movieDto: MovieDTO) {
    return this.movieService.update(id, movieDto);
  }

  @Delete(':id/delete')
  async delete(@Param('id') id): Promise<boolean> {
    return this.movieService.delete(id);
  }

  @Delete('delete/all')
  async deleteAll(): Promise<boolean> {
    return this.movieService.deleteAll();
  }
}
