import { v4 } from "uuid";
import fs from "fs/promises";
import path from "path";

/**
 * Processa a imagem de capa do post: valida tipo, gera nome único e move para a pasta 'uploads/covers'.
 */
export const handleCover = async (file?: Express.Multer.File): Promise<string> => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    // TODO: Validar tamanho do arquivo (ex: 2MB)
    // const maxSize = 2 * 1024 * 1024;
    // if (file && file.size > maxSize) throw new Error("Arquivo muito grande");

    if (file && allowedTypes.includes(file.mimetype)) {
        const ext = path.extname(file.originalname) || ".jpg";
        const coverName = `${v4()}${ext}`;
        const destPath = path.join("uploads", "covers", coverName);

        // TODO: try/catch para tratar erros de I/O
        // TODO: Validar se a extensão corresponde ao tipo MIME
        // TODO: Sanitizar nome original se for usar

        // Move o arquivo do local temporário do Multer para a pasta definitiva
        await fs.rename(file.path, destPath);

        // TODO: Adicionar logs estruturados de sucesso
        return coverName; // Salve esse nome no banco
    }
    // TODO: Remover arquivo temporário inválido se necessário
    // TODO: Adicionar logs estruturados de erro
    throw new Error("Arquivo inválido");
};