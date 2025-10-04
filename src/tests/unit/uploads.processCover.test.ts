import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { processCover, COVERS_DIR, MIME_EXTENSION } from '@/utils/uploads';

// Mock sharp to avoid heavy processing in unit test
vi.mock('sharp', () => {
  return {
    default: () => ({
      rotate: () => ({
        metadata: async () => ({ width: 10, height: 10 }),
        resize: () => ({
          jpeg: () => ({ toFile: async (dest: string) => { await fs.writeFile(dest, Buffer.from('jpegdata')); }}),
          png: () => ({ toFile: async (dest: string) => { await fs.writeFile(dest, Buffer.from('pngdata')); }}),
          toFile: async (dest: string) => { await fs.writeFile(dest, Buffer.from('rawdata')); }
        })
      })
    })
  };
});

describe('processCover', () => {
  beforeEach(async () => {
    await fs.mkdir(COVERS_DIR, { recursive: true });
  });

  it('processa imagem jpeg e retorna path público', async () => {
    const tempFile = path.join('uploads', 'temp', 'tempfile');
    await fs.mkdir(path.dirname(tempFile), { recursive: true });
    await fs.writeFile(tempFile, Buffer.from('fake'));

    const file: Express.Multer.File = {
      fieldname: 'cover',
      originalname: 'qualquer.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 4,
      destination: 'uploads/temp',
      filename: 'tempfile',
      path: tempFile,
      stream: undefined as any,
      buffer: Buffer.from(''),
    };

    const { publicPath } = await processCover({ file, reencode: true });
    expect(publicPath.startsWith('/uploads/covers/')).toBe(true);
  });

  it('falha com mimetype não suportado', async () => {
    const tempFile = path.join('uploads', 'temp', 'tempfile2');
    await fs.mkdir(path.dirname(tempFile), { recursive: true });
    await fs.writeFile(tempFile, Buffer.from('fake'));

    const file: Express.Multer.File = {
      fieldname: 'cover',
      originalname: 'qualquer.xyz',
      encoding: '7bit',
      mimetype: 'application/octet-stream',
      size: 4,
      destination: 'uploads/temp',
      filename: 'tempfile2',
      path: tempFile,
      stream: undefined as any,
      buffer: Buffer.from(''),
    };

    await expect(processCover({ file })).rejects.toThrow();
  });
});
