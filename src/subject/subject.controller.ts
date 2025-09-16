import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { UtilsService } from '../utils/utils.service';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSubjectDto } from './dtos/updateSubject.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { roleEnum } from '../common/enums/roleEnum';

@Controller('subject')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly utilsService: UtilsService
  ) {}

  @Post()
  @Auth(roleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('image',{
    limits: {fileSize: 2 * 1024 * 1024}
  }))
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createSubjectDto: CreateSubjectDto,
    @Res() res: Response 
  ){
    this.utilsService.handleResponse(res, async () => 
      this.subjectService.create(image, createSubjectDto)
    );
  }

  @Get()
  @Auth(roleEnum.ADMIN, roleEnum.ESTUDIANTE, roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  findAll(
    @Res() res: Response
  ){
    this.utilsService.handleResponse(res, async () => 
      this.subjectService.getAll()
    );
  }

  @Get('/image/:id')
  async image(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ){
      return this.subjectService.getImage(id, res);
  }

  @Patch('/:id')
  @Auth(roleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number, 
    @UploadedFile() image: Express.Multer.File,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Res() res: Response 
  ){
    this.utilsService.handleResponse(res, async () => 
      this.subjectService.updateSubject(id, image, updateSubjectDto)
    );
  }

  @Delete('/:id')
  @Auth(roleEnum.ADMIN)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ){
    this.utilsService.handleResponse(res, async () => 
      this.subjectService.deleteSubject(id)
    );
  }

}
