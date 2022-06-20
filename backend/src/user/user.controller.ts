import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import SignInDto from './dto/signIn.dto';
import SignUpDto from './dto/signUp.dto';

@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  @ApiResponse({
    status: 201,
    description: 'Return a user details and auth token',
  })
  async SignUp(@Res() response, @Body() user: SignUpDto) {
    const newUser = await this.userService.signUp(user, this.jwtService);
    return response.status(HttpStatus.CREATED).json(newUser);
  }

  @Post('/signin')
  @ApiResponse({
    status: 201,
    description: 'Return auth token',
  })
  async SignIn(@Res() response, @Body() user: SignInDto) {
    const signInResponse = await this.userService.signIn(user, this.jwtService);
    return response.status(HttpStatus.OK).json(signInResponse);
  }
}
