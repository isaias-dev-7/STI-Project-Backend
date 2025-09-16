import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseIntPipe } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Response } from 'express';
import { UtilsService } from '../utils/utils.service';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { User } from '../user/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { roleEnum } from '../common/enums/roleEnum';
import { AssingResourceDto } from './dto/assing-resource.dto';

@Controller('session')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly utilsService: UtilsService
  ) {}

  @Post()
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  create(
    @Body() createSessionDto: CreateSessionDto,
    @GetUser() user: User,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.sessionService.create(createSessionDto, user)
    );
  }

  @Post('assing/')
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  assign(
     @Body() { idSession, idsResources }: AssingResourceDto,
     @Res() res: Response
  ){
    this.utilsService.handleResponse(res, async () => 
      this.sessionService.assingResourcesByIds(idSession, idsResources)
    );
  }

  @Get()
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  findAll(
    @GetUser() user: User,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.sessionService.findAll(user)
    );
  }

  @Patch(':id')
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.sessionService.update(id, updateSessionDto)
    );
  }

  @Delete(':id')
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.sessionService.remove(id)
    );
  }
}
