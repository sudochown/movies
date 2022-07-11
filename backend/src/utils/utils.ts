import { DeepPartial } from 'typeorm';
import { MovieDTO } from '../movie/movie.dto';
import slugify from 'slugify';

export const DEFAULT_PAGE = 1;
export const DEFAULT_SIZE = 10;

/**
 * Prepare query string filter to array of filter item values.
 *
 * @param filter
 */
export function prepareFilterValues(filter: string): any[] {
  return filter
    .split(',')
    .map((value) =>
      isNaN(Number(value)) ? new RegExp(value, 'i') : Number(value),
    );
}

/**
 * Slugify movie urlKey and return movie object .
 *
 * @param movieDto
 */

export function getMovieWithSlugifiedUrlKey(movieDto: DeepPartial<MovieDTO>) {
  return {
    ...movieDto,
    urlKey: slugify(movieDto.urlKey || movieDto.title, {
      replacement: '-',
      lower: true,
      strict: true,
      trim: true,
      remove: /[$*_+~.()'"!\-:@#<>^%&]/g,
    }),
  };
}
