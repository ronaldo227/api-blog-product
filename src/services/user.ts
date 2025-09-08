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

export const createUser = async ({ name, email, password }: CreateUserProps) => {

    try {
        // 🔒 SEGURANÇA: Normalizar email
        email = email.toLowerCase().trim();
        // 🔒 SEGURANÇA: Verificar se usuário já existe
        const existingUser = await prisma.user.findFirst({
            where: { email }
        });
        
        if (existingUser) {
            throw new Error('User already exists');
        }
        // 🔒 SEGURANÇA: Salt rounds aumentado para 12
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
    } catch (error) {
        console.error('Error creating user:', error);
        return false;
    }
}

export const verifyUser = async ({ email, password }: VerifyProps) => {

    try {
        // 🔒 SEGURANÇA: Normalizar email
        email = email.toLowerCase().trim();
        const user = await prisma.user.findFirst({
            where: { email }
        });
        
        if (!user) {
            // 🔒 SEGURANÇA: Simular tempo de verificação para prevenir timing attacks
            await bcrypt.hash('dummy', 12);
            return false;
        }
        
        // 🔒 SEGURANÇA: Usar compare assíncrono
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return false;
        }
        
        // 🔒 SEGURANÇA: Retornar sem password
        const { password: _, ...userWithoutPassword } = user;
        
        
        return userWithoutPassword;
    } catch (error) {
        console.error('Error verifying user:', error);
        return false;
    }
};
