import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesController } from './movies/movies.controller';
import { JwtModule } from '@nestjs/jwt';
import { isAuthenticated } from './app.middleware';
import { Movie, MovieSchema } from './movies/schema/movies.schema';
import {
  AttributesConfig,
  AttributesConfigSchema,
} from './movies/schema/listing.schema';
import { MoviesService } from './movies/movies.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { User, UserSchema } from './user/schema/user.schema';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_CLUSTER,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_CLUSTER),
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: AttributesConfig.name, schema: AttributesConfigSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    CacheModule.register({
      ttl: 5,
      max: 10,
    }),
    MovieModule,
  ],
  controllers: [MoviesController, UserController],
  providers: [MoviesService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(isAuthenticated).forRoutes(MoviesController);
  }
}
