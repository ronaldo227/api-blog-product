import { PrismaClient } from '@prisma/client';

console.log('🗄️ SUPER DEBUG PRISMA - Initializing Prisma client...');

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
    console.log('🗄️ SUPER DEBUG PRISMA - Prisma client registered globally (development mode)');
} else {
    console.log('🗄️ SUPER DEBUG PRISMA - Prisma client initialized (production mode)');
}

console.log('🗄️ SUPER DEBUG PRISMA - Prisma client ready with debug logging!');

// 🗄️ SUPER DEBUG: Log database operations
const originalConnect = prisma.$connect.bind(prisma);
const originalDisconnect = prisma.$disconnect.bind(prisma);

prisma.$connect = async () => {
    console.log('🗄️ SUPER DEBUG PRISMA - Connecting to database...');
    const result = await originalConnect();
    console.log('🗄️ SUPER DEBUG PRISMA - Database connected successfully!');
    return result;
};

prisma.$disconnect = async () => {
    console.log('🗄️ SUPER DEBUG PRISMA - Disconnecting from database...');
    const result = await originalDisconnect();
    console.log('🗄️ SUPER DEBUG PRISMA - Database disconnected successfully!');
    return result;
};

