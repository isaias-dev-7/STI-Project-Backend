import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { PaginDto } from '../common/dto/paginDto';
import { UtilsService } from '../utils/utils.service';
import { roleEnum } from '../common/enums/roleEnum';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly utilsService: UtilsService
  ) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.userService.create(createUserDto)
    );
  }

  @Get()
  @Auth(roleEnum.ADMIN, roleEnum.PROFESSOR_PRINCIPAL, roleEnum.PROFESSOR_AUXILIAR)
  findAll(
    @Query() paginDto: PaginDto,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async() => 
      this.userService.findAll(paginDto)
    );

  }

  @Get('count/')
  @Auth(roleEnum.ADMIN, roleEnum.ESTUDIANTE, roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  count(
    @Res() res: Response
  ){
    this.utilsService.handleResponse(res, async () => 
      this.userService.userCount()
    );
  }

  @Get(':id')
  @Auth(roleEnum.ADMIN, roleEnum.PROFESSOR_PRINCIPAL, roleEnum.PROFESSOR_AUXILIAR)
  findOne(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.userService.findOne(+id)
    );
  }

  @Get('activate/:id')
  @Auth(roleEnum.ADMIN)
  activate(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.userService.activateUserById(+id)
    );
  }

  @Patch(':id')
  @Auth(roleEnum.ADMIN, roleEnum.ESTUDIANTE, roleEnum.PROFESSOR_PRINCIPAL, roleEnum.PROFESSOR_AUXILIAR)
  update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.userService.update(+id, user, updateUserDto)
    );
  }

  @Delete(':id')
  @Auth(roleEnum.ADMIN)
  remove(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () =>
      this.userService.remove(+id)
    );
  }
}
