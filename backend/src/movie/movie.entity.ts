import {
  Entity,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  MaxLength,
  IsUrl,
} from 'class-validator';
import ObjectID from 'bson-objectid';

@Entity({ name: 'movie' })
export class Movie {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, {
    message: 'Title length must be less then 1000 characters.',
  })
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @IsUrl(undefined, {
    message:
      'Logo property should be valid external url (e.g.: https://exmample.com/image.jpeg).',
  })
  logo: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, {
    message: 'Title length must be less then 1000 characters.',
  })
  description: string;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @Column()
  @IsArray()
  genres: string[];

  @Column()
  @IsNumber()
  rating?: number;

  @Column()
  @IsArray()
  @IsNotEmpty()
  cast: string[];

  @Column({ unique: true })
  @IsString()
  urlKey: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: string;
}
