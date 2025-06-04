import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

export const Roles = Reflector.createDecorator<UserRole[]>();
