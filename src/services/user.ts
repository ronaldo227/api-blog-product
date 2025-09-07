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
    console.log('👤 SUPER DEBUG CREATE USER - START:', {
        timestamp: new Date().toISOString(),
        inputData: {
            nameLength: name.length,
            emailLength: email.length,
            passwordLength: password.length,
            originalEmail: email
        }
    });

    try {
        // 🔒 SEGURANÇA: Normalizar email
        email = email.toLowerCase().trim();
        console.log('👤 SUPER DEBUG CREATE USER - Email normalized:', {
            normalizedEmail: email
        });

        console.log('👤 SUPER DEBUG CREATE USER - Checking if user exists...');
        // 🔒 SEGURANÇA: Verificar se usuário já existe
        const existingUser = await prisma.user.findFirst({
            where: { email }
        });
        
        console.log('👤 SUPER DEBUG CREATE USER - Existing user check:', {
            userExists: !!existingUser,
            existingUserId: existingUser?.id || null
        });
        
        if (existingUser) {
            console.log('👤 SUPER DEBUG CREATE USER - USER ALREADY EXISTS');
            throw new Error('User already exists');
        }

        console.log('👤 SUPER DEBUG CREATE USER - Hashing password...');
        // 🔒 SEGURANÇA: Salt rounds aumentado para 12
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log('👤 SUPER DEBUG CREATE USER - Password hashed:', {
            saltRounds,
            hashedLength: hashedPassword.length
        });

        console.log('👤 SUPER DEBUG CREATE USER - Creating user in database...');
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

        console.log('👤 SUPER DEBUG CREATE USER - USER CREATED SUCCESS:', {
            userId: newUser.id,
            userName: newUser.name,
            userEmail: newUser.email,
            userStatus: newUser.status
        });

        return newUser;
    } catch (error) {
        console.log('👤 SUPER DEBUG CREATE USER - ERROR:', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        console.error('Error creating user:', error);
        return false;
    }
}

export const verifyUser = async ({ email, password }: VerifyProps) => {
    console.log('🔐 SUPER DEBUG VERIFY USER - START:', {
        timestamp: new Date().toISOString(),
        inputData: {
            emailLength: email.length,
            passwordLength: password.length,
            originalEmail: email
        }
    });

    try {
        // 🔒 SEGURANÇA: Normalizar email
        email = email.toLowerCase().trim();
        console.log('🔐 SUPER DEBUG VERIFY USER - Email normalized:', {
            normalizedEmail: email
        });

        console.log('🔐 SUPER DEBUG VERIFY USER - Searching for user...');
        const user = await prisma.user.findFirst({
            where: { email }
        });
        
        console.log('🔐 SUPER DEBUG VERIFY USER - User search result:', {
            userFound: !!user,
            userId: user?.id || null,
            userEmail: user?.email || null,
            userStatus: user?.status || null
        });
        
        if (!user) {
            console.log('🔐 SUPER DEBUG VERIFY USER - USER NOT FOUND, simulating hash time...');
            // 🔒 SEGURANÇA: Simular tempo de verificação para prevenir timing attacks
            await bcrypt.hash('dummy', 12);
            console.log('🔐 SUPER DEBUG VERIFY USER - VERIFICATION FAILED (no user)');
            return false;
        }
        
        console.log('🔐 SUPER DEBUG VERIFY USER - Comparing passwords...');
        // 🔒 SEGURANÇA: Usar compare assíncrono
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        console.log('🔐 SUPER DEBUG VERIFY USER - Password comparison result:', {
            passwordValid: isValidPassword,
            hashedPasswordLength: user.password.length
        });
        
        if (!isValidPassword) {
            console.log('🔐 SUPER DEBUG VERIFY USER - VERIFICATION FAILED (invalid password)');
            return false;
        }
        
        console.log('🔐 SUPER DEBUG VERIFY USER - PASSWORD VALID, preparing response...');
        // 🔒 SEGURANÇA: Retornar sem password
        const { password: _, ...userWithoutPassword } = user;
        
        console.log('🔐 SUPER DEBUG VERIFY USER - VERIFICATION SUCCESS:', {
            userId: userWithoutPassword.id,
            userEmail: userWithoutPassword.email,
            userName: userWithoutPassword.name,
            userStatus: userWithoutPassword.status
        });
        
        return userWithoutPassword;
    } catch (error) {
        console.log('🔐 SUPER DEBUG VERIFY USER - ERROR:', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        console.error('Error verifying user:', error);
        return false;
    }
};
