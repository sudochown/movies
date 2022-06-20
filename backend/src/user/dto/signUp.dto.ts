import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserProperties } from '../schema/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ type: String })
  @IsEmail()
  [UserProperties.email]: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  [UserProperties.password]: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  [UserProperties.passwordRepeat]: string;
}

export default SignUpDto;
