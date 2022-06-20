import { MiddlewareConsumer, Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CLUSTER),
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: AttributesConfig.name, schema: AttributesConfigSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [MoviesController, UserController],
  providers: [MoviesService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(isAuthenticated).forRoutes(MoviesController);
  }
}
