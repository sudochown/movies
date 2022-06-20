import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { QueryParams } from './ListingParams';
import { MovieProperties } from './schema/movies.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SortDirection } from './types';

@ApiTags('movies')
@Controller('movies')
@ApiBearerAuth('JWT')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  @Get()
  @ApiQuery({ name: 'genres', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({
    name: 'sort_field',
    type: String,
    required: false,
    enum: Object.values(MovieProperties),
  })
  @ApiQuery({
    name: 'sort_direction',
    type: Number,
    required: false,
    enum: [SortDirection.asc, SortDirection.desc],
  })
  list(
    @Query()
    query: QueryParams,
  ) {
    return this.moviesService.list(query);
  }

  @Get('/url-key/:urlKey')
  getByUrlKey(@Param(MovieProperties.urlKey) urlKey: string) {
    return this.moviesService.getByUrlKey(urlKey);
  }

  @Get('genres')
  getAllGenres() {
    return this.moviesService.getAttributeOptions(MovieProperties.genres);
  }

  @Get('attributes')
  getAttributes() {
    return this.moviesService.getAttributes();
  }
}
