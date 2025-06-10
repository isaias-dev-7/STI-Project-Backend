import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, ParseIntPipe, Query } from '@nestjs/common';
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
import { PaginDto } from 'src/common/dto/paginDto';

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
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  findAll(
    @GetUser() user: User,
    @Query() paginDto: PaginDto,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.resourceService.findAll(user, paginDto)
    );
  }

  @Get(':id')
  @Auth(roleEnum.ESTUDIANTE)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ){
    this.utilsService.handleResponse(res, async () => 
      this.resourceService.findOne(id)
    );
  }

  @Get('/content/:id')
    async image(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response
    ){
        return this.resourceService.getResourceContent(id, res);
    }

  @Patch(':id')
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateResourceDto: UpdateResourceDto,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.resourceService.update(id, updateResourceDto)
    );
  }

  @Delete(':id')
  @Auth(roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    this.utilsService.handleResponse(res, async () => 
      this.resourceService.remove(id)
    );
  }
}
