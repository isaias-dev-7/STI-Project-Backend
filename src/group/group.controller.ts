import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseIntPipe } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilsService } from '../utils/utils.service';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { roleEnum } from 'src/common/enums/roleEnum';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly utilsService: UtilsService
  ) {}

  @Post()
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  create(
    @Body() createGroupDto: CreateGroupDto,
    @GetUser() professor: User,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.groupService.create(createGroupDto, professor)
    );
  }

  @Get()
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  findAll(
    @GetUser() professor: User,
    @Res() res: Response
  ) {
     this.utilsService.handleResponse(res, async () => 
       this.groupService.findAll(professor)
    )
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateGroupDto: UpdateGroupDto,
    @Res() res: Response
  ) {
      this.utilsService.handleResponse(res, async () => 
        this.groupService.update(id, updateGroupDto)
      );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.groupService.remove(id)
    );
  }
}
