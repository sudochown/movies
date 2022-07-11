import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument, MovieProperties } from './schema/movies.schema';
import {
  AttributesConfig,
  AttributesConfigDocument,
  AttributesConfigProperties,
} from './schema/listing.schema';
import {
  DEFAULT_PAGE,
  DEFAULT_SIZE,
  prepareFilterValues,
} from '../utils/utils';
import { SortDirection } from './types';
import { QueryParams } from './ListingParams';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(AttributesConfig.name)
    private attributesConfig: Model<AttributesConfigDocument>,
  ) {}

  /**
   * Get movies collection - sorted, paginated and filtered.
   *
   * @param params
   */
  async list(params: QueryParams): Promise<{ items: Movie[]; total: number }> {
    const filters = {};
    let defaultSortField = MovieProperties.title as string;
    const {
      sort_field,
      limit = DEFAULT_SIZE,
      page = DEFAULT_PAGE,
      sort_direction = 'asc',
      ...rest
    } = params;
    const filterParams = Object.keys(rest);

    const attributes = await this.attributesConfig
      .find({ [AttributesConfigProperties.useOnListing]: 1 })
      .exec();

    attributes
      .filter((attribute) => !!attribute?.field)
      .forEach((attribute) => {
        if (attribute?.isFilterable && filterParams.includes(attribute.field)) {
          filters[attribute.field] = {
            $in: prepareFilterValues(rest[attribute.field]),
          };
        }

        if (attribute?.isDefaultSortField) {
          defaultSortField = attribute.field;
        }
      });

    return {
      items: await this.movieModel
        .find(filters)
        .sort({
          [sort_field]:
            sort_direction === 'asc' ? SortDirection.asc : SortDirection.desc,
        })
        .limit(limit * page)
        .skip((page - 1) * limit)
        .exec(),
      total: await this.movieModel.estimatedDocumentCount(filters),
    };
  }

  /**
   * Retrieve movie details by url-key.
   *
   * @param urlKey
   */
  async getByUrlKey(urlKey: string): Promise<Movie> {
    return this.movieModel.findOne({ [MovieProperties.urlKey]: urlKey }).exec();
  }

  /**
   * Retrieve available attribute options.
   */
  async getAttributeOptions(field: MovieProperties): Promise<string[]> {
    return this.movieModel.distinct(field).exec();
  }

  /**
   * Get movie attributes metadata.
   */
  async getAttributes(): Promise<{
    attributes: AttributesConfig[];
    options: { [key: string]: any[] };
  }> {
    const options = {};
    const attributes = await this.attributesConfig.find().exec();

    for (const a of attributes) {
      if (a?.[AttributesConfigProperties.isFilterable]) {
        options[a?.[AttributesConfigProperties.field]] =
          await this.getAttributeOptions(
            a?.[AttributesConfigProperties.field] as MovieProperties,
          );
      }
    }

    return { attributes, options };
  }
}
