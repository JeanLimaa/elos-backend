import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/decorators/Roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<UserRole[]>(Roles, context.getHandler());
        if (!requiredRoles) {
            return true;
        }
        
        const { user } = context.switchToHttp().getRequest();
        
        if (!user) {
            return false;
        }

        return this.matchRoles(user.role, requiredRoles);
    }

    private matchRoles(userRole: UserRole, requiredRoles: UserRole[]): boolean {
        return requiredRoles.includes(userRole);
    }
}