import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { ensureUploadDirs, TEMP_DIR, MIME_EXTENSION } from '@/utils/uploads';

// Garante diretórios assincronamente sem usar top-level await (fire and forget)
(async () => {
    try { await ensureUploadDirs(); } catch { /* noop */ }
})();

const uploadFolder = path.resolve(TEMP_DIR);

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (MIME_EXTENSION[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido'));
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

