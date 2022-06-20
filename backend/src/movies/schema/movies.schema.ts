import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MovieProperties {
  title = 'title',
  logo = 'logo',
  description = 'description',
  year = 'year',
  genres = 'genres',
  rating = 'rating',
  cast = 'cast',
  urlKey = 'urlKey',
}

@Schema()
export class Movie {
  @ApiProperty({ type: String })
  @Prop({ required: true })
  [MovieProperties.title]: string;

  @ApiPropertyOptional({ type: String })
  @Prop()
  [MovieProperties.logo]: string;

  @ApiPropertyOptional({ type: String })
  @Prop()
  [MovieProperties.description]: string;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  [MovieProperties.year]: string;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  [MovieProperties.genres]: string[];

  @ApiPropertyOptional({ type: Number, default: 0 })
  @Prop()
  [MovieProperties.rating]: number;

  @ApiPropertyOptional({ type: String })
  @Prop()
  [MovieProperties.cast]: string;

  @ApiProperty({ type: String })
  @Prop({ unique: true, lowercase: true, required: true })
  [MovieProperties.urlKey]: string;
}

export type MovieDocument = Movie & Document;

export const MovieSchema = SchemaFactory.createForClass(Movie);
