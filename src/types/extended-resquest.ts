import { Request } from 'express';
import { User } from '@prisma/client';

// Extende o Request do Express para incluir a propriedade userId

type userWithoutPassword = Omit<User, 'password'>;
export type ExtendedRequest = Request & {
    userId?: userWithoutPassword; // Adiciona a propriedade userId opcional
};