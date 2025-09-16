import { SetMetadata } from "@nestjs/common";
import { roleEnum } from "src/common/enums/roleEnum";

export const META_ROLES = 'roles'
export const RoleProtected = (...args: roleEnum[]) => SetMetadata(META_ROLES, args);