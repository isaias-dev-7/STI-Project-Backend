import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UtilsService } from '../utils/utils.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly utilsService: UtilsService
  ) {}

  @Post('/login')
  login(
    @Body() login: LoginDto,
    @Res() res: Response
  ){
    this.utilsService.handleResponse(res, async () =>
       this.authService.login(login)
    )
  }

  @Post('/test')
  test(
    @Body() message: {message: string},
    @Res() res: Response
  ){
    return;
  }
}
