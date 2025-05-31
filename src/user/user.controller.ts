import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { PaginDto } from '../common/dto/paginDto';
import { UtilsService } from '../utils/utils.service';
import { roleEnum } from '../common/enums/roleEnum';
import { Auth } from '../auth/decorators/auth.decorator';

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

  @Patch(':id')
  @Auth(roleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
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
