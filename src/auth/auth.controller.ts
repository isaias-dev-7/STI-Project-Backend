import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UtilsService } from '../utils/utils.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ISendMessage } from 'src/common/interfaces/sendMessage.interface';

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
    @Body() body: ISendMessage,
    @Res() res: Response
  ){
    return res.status(200).json({message: "El chatbot no esta disponible en estos momentos disculpe los problemas ocasionados"});
  }
}
