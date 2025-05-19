import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/decorators/Roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>(Roles, context.getHandler());
        if (!requiredRoles) {
            return true;
        }
        
        const { user } = context.switchToHttp().getRequest();

        return this.matchRoles(user.role, requiredRoles);
    }

    private matchRoles(userRoles: string[], requiredRoles: string[]): boolean {
        return requiredRoles.some((role) => userRoles.includes(role));
    }
}