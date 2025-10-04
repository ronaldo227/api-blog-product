import { prisma } from "../libs/prisma";
import bcrypt from 'bcrypt';

type CreateUserProps = {
    name: string;
    email: string;
    password: string;
}

type VerifyProps = {
    email: string;
    password: string;
}

// Cria usuário com hash bcrypt (12 rounds). Previne TOCTOU via P2002.
export const createUser = async ({ name, email, password }: CreateUserProps) => {
    try {
        email = email.toLowerCase().trim();
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = await prisma.user.create({
            data: {
                name: name.trim(),
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                status: true
                // 🔒 SEGURANÇA: Não retornar password
            }
        });

        return newUser;
    } catch (error: any) {
        // Prisma P2002 = unique constraint violation
        if (error?.code === 'P2002') {
            console.error('Error creating user: User already exists');
            return false;
        }
        console.error('Error creating user:', error);
        return false;
    }
}

// Verifica credenciais. Usa hash dummy para prevenir timing attack.
export const verifyUser = async ({ email, password }: VerifyProps) => {

    try {
        email = email.toLowerCase().trim();
        const user = await prisma.user.findFirst({
            where: { email }
        });
        
        if (!user) {
            // Timing attack prevention: simulate verification delay
            await bcrypt.hash('dummy', 12);
            return false;
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return false;
        }
        
        const { password: _, ...userWithoutPassword } = user;
        
        
        return userWithoutPassword;
    } catch (error) {
        console.error('Error verifying user:', error);
        return false;
    }
};
