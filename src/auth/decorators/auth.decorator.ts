import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { roleEnum } from "src/common/enums/roleEnum";
import { RoleProtected } from "./roleProtected.decorator";
import { UserRoleGuard } from "../guards/userRole.guard";

export const  Auth = (...roles: roleEnum[]) => 
    applyDecorators(
      RoleProtected(...roles),
      UseGuards( AuthGuard(), UserRoleGuard ),

    );