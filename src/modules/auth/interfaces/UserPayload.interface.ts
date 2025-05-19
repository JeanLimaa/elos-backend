import { UserRole } from "@prisma/client";

export interface UserPayload {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}