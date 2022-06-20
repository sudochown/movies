import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export type UserDocument = User & Document;

export enum UserProperties {
  email = 'email',
  password = 'password',
  passwordRepeat = 'passwordRepeat',
  createdDate = 'createdDate',
}

@Schema()
export class User {
  @ApiProperty({ type: String })
  @Prop({ required: true, unique: true, lowercase: true })
  [UserProperties.email]: string;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  [UserProperties.password]: string;

  @ApiProperty({ type: String })
  @Prop()
  [UserProperties.passwordRepeat]: string;

  @ApiPropertyOptional({ type: Date, default: Date.now() })
  @Prop({ default: Date.now() })
  [UserProperties.createdDate]: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
