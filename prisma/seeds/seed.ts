import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordUser = await bcrypt.hash('user', 10);
    const passwordAdmin = await bcrypt.hash('admin', 10);

    await prisma.user.createMany({
        data: [
            {
                email: 'user@user.com',
                name: 'User',
                password: passwordUser,
                role: 'USER',
            },
            {
                email: 'admin@admin.com',
                password: passwordAdmin,
                role: 'ADMIN',
                name: 'Admin',
            }
        ]
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });