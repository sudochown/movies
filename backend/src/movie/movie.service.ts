import { Injectable, ConflictException } from '@nestjs/common';
import { DeepPartial, MongoRepository } from 'typeorm';
import ObjectID from 'bson-objectid';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieDTO } from './movie.dto';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';
import { SortDirection } from '../types';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { getMovieWithSlugifiedUrlKey } from '../utils/utils';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: MongoRepository<Movie>,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    filters?: ObjectLiteral,
    sortOrder?: FindOptionsOrder<Movie>,
  ): Promise<{ items: Movie[]; total: number; aggregation: ObjectLiteral }> {
    const items = await this.movieRepository.find({
      order: sortOrder || { year: SortDirection.DESC },
      where: filters,
      skip: Number(page - 1) * Number(limit),
      take: Number(limit),
      cache: true,
    });

    const total = await this.movieRepository.count();

    const aggregation = {
      year: await this.movieRepository.distinct('year', {}),
      rating: await this.movieRepository.distinct('rating', {}),
      genres: await this.movieRepository.distinct('genres', {}),
    };

    return { items, total, aggregation };
  }

  async findById(id: string): Promise<Movie | null> {
    return await this.movieRepository.findOneBy({
      _id: new ObjectID(id),
    });
  }

  async create(movieDto: DeepPartial<MovieDTO>): Promise<Movie> {
    const movieEntity = Object.assign(
      new Movie(),
      movieDto,
      getMovieWithSlugifiedUrlKey(movieDto),
    );

    try {
      return await this.movieRepository.save(movieEntity);
    } catch (e) {
      throw new ConflictException(e?.toString());
    }
  }

  async update(_id: string, movieDto: DeepPartial<MovieDTO>) {
    const existedEntity = await this.movieRepository.findOneBy({
      _id: new ObjectID(_id),
    });

    if (!existedEntity) {
      throw new ConflictException(
        `Sorry but movie that you trying to update doesn\'t exist anymore. Try to create new movie.`,
      );
    }

    const movieEntity = Object.assign(
      new Movie(),
      existedEntity,
      getMovieWithSlugifiedUrlKey(movieDto),
    );

    try {
      const res = await this.movieRepository.updateOne(
        { _id: new ObjectID(_id) },
        { $set: { ...movieEntity } },
      );
      return movieEntity;
    } catch (e) {
      throw new ConflictException(e?.toString());
    }
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.movieRepository.delete(id);

    return Boolean(deleteResult?.affected);
  }

  async deleteAll(): Promise<boolean> {
    const deleteResult = await this.movieRepository.deleteMany({});

    return Boolean(deleteResult?.deletedCount);
  }
}
