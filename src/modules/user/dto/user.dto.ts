import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

export class UserResponseDto {
    @ApiProperty({
        example: 1,
        type: Number,
    })
    id: number;

    @ApiProperty({
        example: 'John Doe',
        type: String,
    })
    name: string;

    @ApiProperty({
        example: 'example@example.com'
    })
    email: string;

    @ApiProperty({
        example: 'ADMIN',
        enum: UserRole,
    })
    role: UserRole;
}