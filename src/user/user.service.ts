import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './model/user.model';
import { PaginDto } from '../common/dto/paginDto';
import { messagesResponse } from '../common/messagesResponse';
import { ErrorResponse } from '../common/customResponses/errorResponse';
import { SuccessResponse } from '../common/customResponses/successResponse';
import { UtilsService } from '../utils/utils.service';
import { MyResponse } from '../common/customResponses/response';
import { PaginResponse } from '../common/customResponses/paginResponse';
import { User } from './entities/user.entity';

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

  async update(id: number, user: User, updateUserDto: UpdateUserDto): Promise<MyResponse> {
    try {
      await this.userModel.updateUser(id, user, updateUserDto);
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

  async activateUserById(id: number){
    try {
      if((await this.userModel.getUserbyId(id)).active) throw ErrorResponse.build({ message: messagesResponse.userAlreadyActive });
      await this.userModel.activateUser(id);
      return SuccessResponse.build({ message: messagesResponse.userActived });
    } catch (error) {
      this.handleException(error);
    }
  }

  async userCount(){
    try {
      const {...rest} = await this.userModel.userCountOnSystem();
      return SuccessResponse.build({data: {...rest}});
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
