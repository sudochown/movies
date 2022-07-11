import { IsArray, IsDefined, IsEmail, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class MovieDTO {
  @Exclude()
  @IsDefined()
  @IsString()
  readonly _id: string
  
  @IsDefined()
  @IsString()
  readonly title: string;
  
  
  @IsDefined()
  @IsString()
  readonly logo: string;
  
  @IsDefined()
  @IsEmail()
  readonly description: string;
  
  @IsDefined()
  @IsString()
  readonly year: number;
  
  @IsDefined()
  @IsArray()
  readonly genres: string[];
  
  @IsDefined()
  @IsArray()
  
  readonly rating: number;
  
  @IsDefined()
  @IsArray()
  readonly cast: string;

  @IsDefined()
  @IsArray()
  readonly urlKey: string;
}
