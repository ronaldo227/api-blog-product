// Configuração segura de upload: validação dupla MIME+extensão, UUID, limites de tamanho
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import { v4 } from 'uuid';
import { ensureUploadDirs, TEMP_DIR, MIME_EXTENSION } from '@/utils/uploads';

(async () => {
    try { await ensureUploadDirs(); } catch { /* noop */ }
})();

const uploadFolder = path.resolve(TEMP_DIR);

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimes = Object.keys(MIME_EXTENSION);
    if (!allowedMimes.includes(file.mimetype)) {
        return cb(new Error('Tipo de arquivo não permitido'));
    }
    const ext = path.extname(file.originalname).toLowerCase();
    const validExts = ['.jpg', '.jpeg', '.png', '.gif'];
    if (!validExts.includes(ext)) {
        return cb(new Error('Extensão de arquivo não permitida'));
    }
    cb(null, true);
};

/**
 * Custom storage engine with UUID-based filename generation.
 * Prevents collision attacks and filename-based exploits.
 */
const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const ext = MIME_EXTENSION[file.mimetype] || '.bin';
        const safeName = `${v4()}${ext}`;
        cb(null, safeName);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1,
        fields: 10 // Limitar campos para prevenir DoS por campo gigante
    },
    fileFilter
});

