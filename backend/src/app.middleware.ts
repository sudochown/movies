import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user/user.service';

interface UserRequest extends Request {
  user: any;
}

@Injectable()
export class isAuthenticated implements NestMiddleware {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: UserRequest, res: Response, next: NextFunction) {
    if (!req?.headers?.authorization?.startsWith('Bearer')) {
      throw new HttpException('No token found', HttpStatus.NOT_FOUND);
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = await this.jwt.verify(token);
    const user = await this.userService.getUserDetails(decoded.email);

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    req.user = user;
    next();
  }
}
