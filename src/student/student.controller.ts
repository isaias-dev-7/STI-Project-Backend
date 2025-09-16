import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { StudentService } from './student.service';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { User } from '../user/entities/user.entity';
import { LearningStyleDto } from './dto/learningStyle.dto';
import { Response } from 'express';
import { UtilsService } from '../utils/utils.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { roleEnum } from '../common/enums/roleEnum';

@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly utilsService: UtilsService
  ) {}

  @Post('/setLearningStyle')
  @Auth(roleEnum.ESTUDIANTE)
  learningStyle(
    @GetUser() user: User,
    @Body() { learningStyle }: LearningStyleDto,
    @Res() res: Response
  ){
    this.utilsService.handleResponse(res, async () =>
      this.studentService.learningStyleStudent(user, learningStyle)
    );
  }

  @Get('/getLearningStyle/:id')
  @Auth(roleEnum.ADMIN, roleEnum.PROFESSOR_AUXILIAR, roleEnum.PROFESSOR_PRINCIPAL)
  getLearning(
    @Param('id') id: string,
    @Res() res: Response
  ){
    this.utilsService.handleResponse(res, async () =>
      this.studentService.getLearningStyle(+id)
    );
  }
}
