import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Multer configurado para aceitar apenas imagens (jpg, jpeg, png, gif) até 5MB, salvando em uploads/temp

// Caminho absoluto para a pasta de uploads temporários
const uploadFolder = path.resolve(__dirname, '../../uploads/temp');

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas.'));
    }
};
export const upload = multer({
    dest: uploadFolder,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1
    },
    fileFilter
});

