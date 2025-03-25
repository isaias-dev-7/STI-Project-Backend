import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './model/user.model';
import { Response } from 'express';
import { PaginDto } from 'src/common/dto/paginDto';
import { messagesResponse } from 'src/common/messagesResponse';
import { ErrorResponse } from 'src/common/customResponses/errorResponse';
import { SuccessResponse } from 'src/common/customResponses/successResponse';
import { UtilsService } from 'src/utils/utils.service';
import { MyResponse } from 'src/common/customResponses/response';
import { PaginResponse } from 'src/common/customResponses/paginResponse';

@Injectable()
export class UserService {
  constructor(
    private readonly userModel: UserModel,
    private readonly utilsService: UtilsService
  ){}

  async create(
    {email, ...rest}: CreateUserDto,
  ): Promise <MyResponse>{
    try {
      let exists = await this.userModel.existUserByEmail(email);
      if (exists){
        throw ErrorResponse.build({
          message: messagesResponse.emailAlreadyExist
        });
      }

      const { username } = await this.userModel.createUser({email, ...rest});
      
      return SuccessResponse.build({
        message: messagesResponse.userCreated,
        data: { username }
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(
    paginDto: PaginDto
  ): Promise<MyResponse>{
    try {
      const data = await this.userModel.getAllUsersWithPagination(paginDto);
      return PaginResponse.build(data);
    } catch (error) {
      this.handleException(error);
    }
  }

  async findOne(
    id: number,
  ): Promise<MyResponse> {
    try {
      const userDb = await this.userModel.getUserbyId(id);
      return SuccessResponse.build({
        data: userDb
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<MyResponse> {
    try {
      await this.userModel.updateUser(id, updateUserDto);
      return SuccessResponse.build({
        message: messagesResponse.userUpdated
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(
    id: number,
  ): Promise<MyResponse>{
    try {
      await this.userModel.deleteUserbyID(id);
      return SuccessResponse.build({
        message: messagesResponse.userDeleted
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  handleException(error: any){
    console.error(`[ERROR] - handleException - user.service.ts`);
    console.error({ error });
    throw this.utilsService.handleError(error);
  }
}
