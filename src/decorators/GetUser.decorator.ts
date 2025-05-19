import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "src/modules/auth/interfaces/UserPayload.interface";

export const GetUser = createParamDecorator(
    (data: keyof UserPayload, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Caso seja especificado um campo, retorna apenas ele (ex: id, email, etc.)
        return data ? user?.[data] : user;
    }
)