// Processamento de upload: Sharp remove EXIF/payloads, redimensiona, gera UUID
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { v4 } from 'uuid';
import { AppLogger } from './logger-modern';

export const UPLOAD_ROOT = 'uploads';
export const TEMP_DIR = path.join(UPLOAD_ROOT, 'temp');
export const COVERS_DIR = path.join(UPLOAD_ROOT, 'covers');

export const MIME_EXTENSION: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif'
};

export async function ensureUploadDirs() {
  for (const dir of [UPLOAD_ROOT, TEMP_DIR, COVERS_DIR]) {
    await fs.mkdir(dir, { recursive: true });
  }
}

export interface ProcessCoverOptions {
  file: Express.Multer.File;
  reencode?: boolean;
  maxWidth?: number;
}

// Processa imagem: re-codifica com Sharp (remove EXIF), redimensiona, limpa temp
export async function processCover({ file, reencode = true, maxWidth = 1600 }: ProcessCoverOptions): Promise<{ publicPath: string; finalPath: string; filename: string; }> {
  const ext = MIME_EXTENSION[file.mimetype];
  if (!ext) {
    throw new Error('Tipo de arquivo não suportado');
  }

  await ensureUploadDirs();

  const filename = `${v4()}${ext}`;
  const finalPath = path.join(COVERS_DIR, filename);

  try {
    if (reencode) {
      // Re-encode elimina metadados e payloads maliciosos
      const image = sharp(file.path).rotate();
      const resized = await image.metadata();
      const pipeline = image.resize({
        width: resized.width && resized.width > maxWidth ? maxWidth : resized.width,
        withoutEnlargement: true
      });
      if (file.mimetype === 'image/png') {
        await pipeline.png({ compressionLevel: 8 }).toFile(finalPath);
      } else if (file.mimetype === 'image/gif') {
        // GIF permanece como está (sharp suport básico)
        await pipeline.toFile(finalPath);
      } else {
        await pipeline.jpeg({ quality: 82 }).toFile(finalPath);
      }
      // Remove arquivo temporário
      await fs.rm(file.path, { force: true });
    } else {
      await fs.rename(file.path, finalPath);
    }

    const publicPath = `/uploads/covers/${filename}`;
    AppLogger.info('Cover processada com sucesso', { publicPath, finalPath, size: file.size, mimetype: file.mimetype });
    return { publicPath, finalPath, filename };
  } catch (error: any) {
    AppLogger.error('Falha ao processar cover', error);
    // Cleanup em caso de erro
    await fs.rm(finalPath, { force: true }).catch(() => {});
    throw new Error('Falha ao processar imagem');
  }
}
