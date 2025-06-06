import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { UtilsService } from '../utils/utils.service';
import { Response } from 'express';
import { roleEnum } from '../common/enums/roleEnum';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('resource')
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly utilsService: UtilsService
  ) {}

  @Post()
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  @UseInterceptors(FileInterceptor('file',{
      limits: {fileSize: 40 * 1024 * 1024}
    }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createResourceDto: CreateResourceDto,
    @GetUser() user: User,
    @Res() res: Response 
  ) {
    this.utilsService.handleResponse(res, () => 
      this.resourceService.create(file, createResourceDto, user)
    );
  }

  @Get()
  findAll() {
    return this.resourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto) {
    return this.resourceService.update(+id, updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceService.remove(+id);
  }
}
