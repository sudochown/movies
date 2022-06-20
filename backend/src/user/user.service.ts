import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserProperties } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import SignInDto from './dto/signIn.dto';
import SignUpDto from './dto/signUp.dto';

const {
  email: emailKey,
  password: passwordKey,
  passwordRepeat: passwordRepeatKey,
} = UserProperties;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Register new user.
   *
   * @param user
   * @param jwt
   */
  async signUp(
    user: SignUpDto,
    jwt: JwtService,
  ): Promise<HttpException | { user: Partial<User>; token: string }> {
    const existedUser = await this.userModel.findOne({ [emailKey]: user[emailKey] }).exec();

    if (existedUser) {
      return new HttpException(
        'User with such email already registered. Try to sign-in.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user[passwordKey] !== user[passwordRepeatKey]) {
      return new HttpException('Passwords mismatch.', HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user[passwordKey], salt);
    const reqBody = { [emailKey]: user[emailKey], [passwordKey]: hash };
    const newUser = await new this.userModel(reqBody).save();

    return {
      token: jwt.sign({ email: user.email }),
      user: {
        [UserProperties.email]: newUser.email,
        [UserProperties.createdDate]: newUser.createdDate,
      },
    };
  }

  /**
   * Validate user credentials and sing in.
   *
   * @param user
   * @param jwt
   */
  async signIn(
    user: SignInDto,
    jwt: JwtService,
  ): Promise<HttpException | { token: string; user: Partial<User> }> {
    const existingUser = await this.userModel
      .findOne({ email: user.email })
      .exec();
    let isPasswordValid = false;

    if (existingUser) {
      isPasswordValid = await bcrypt.compare(
        user?.password,
        existingUser?.password,
      );
    }

    if (!isPasswordValid) {
      return new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      token: jwt.sign({ email: user.email }),
      user: {
        [UserProperties.email]: existingUser.email,
        [UserProperties.createdDate]: existingUser.createdDate,
      },
    };
  }

  /**
   * Get user details by provided email.
   *
   * @param email
   */
  async getUserDetails(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }
}
