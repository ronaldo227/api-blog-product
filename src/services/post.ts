import { processCover } from '@/utils/uploads';

// API simplificada para controllers reutilizarem
export const handleCover = async (file?: Express.Multer.File): Promise<string> => {
    if (!file) {
        throw new Error('Arquivo ausente');
    }
    const { publicPath } = await processCover({ file, reencode: true });
    return publicPath;
};