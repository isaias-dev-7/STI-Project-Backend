import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { UtilsService } from '../utils/utils.service';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { User } from '../user/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { roleEnum } from '../common/enums/roleEnum';
import { Response } from 'express';


@Controller('learning-path')
export class LearningPathController {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly learningPathService: LearningPathService
  ) {}

  @Get(':subjectId')
  @Auth(roleEnum.ESTUDIANTE)
  getPath(
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @GetUser() user: User,
    @Res() res: Response
  ){
    this.utilsService.handleResponse(res, async () => 
      this.learningPathService.createPath(user, subjectId)
    )
  }
}
