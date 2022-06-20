import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserProperties } from '../schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ type: String })
  @IsEmail()
  [UserProperties.email]: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  [UserProperties.password]: string;
}

export default SignInDto;
