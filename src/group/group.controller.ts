import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UtilsService } from '../utils/utils.service';
import { Response } from 'express';

@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly utilsService: UtilsService
  ) {}

  @Post()
  create(
    @Body() createGroupDto: CreateGroupDto,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.groupService.create(createGroupDto)
    );
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}
