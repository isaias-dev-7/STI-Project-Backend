import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { PaginDto } from 'src/common/dto/paginDto';
import { UtilsService } from 'src/utils/utils.service';

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
  findAll(
    @Query() paginDto: PaginDto,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async() => 
      this.userService.findAll(paginDto)
    );

  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.userService.findOne(+id)
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () =>
      this.userService.remove(+id)
    );
  }
}
