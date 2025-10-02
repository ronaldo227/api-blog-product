import { v4 } from "uuid";
import fs from "fs/promises";
import path from "path";

/**
 * Processa a imagem de capa do post: valida tipo, gera nome único e move para a pasta 'uploads/covers'.
 */
export const handleCover = async (file?: Express.Multer.File): Promise<string> => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    

    if (file && allowedTypes.includes(file.mimetype)) {
        const ext = path.extname(file.originalname) || ".jpg";
        const coverName = `${v4()}${ext}`;
        const destPath = path.join("uploads", "covers", coverName);

    
    await fs.rename(file.path, destPath);

    // TODO: Adicionar logs estruturados de sucesso
    // Retorne o caminho público para uso no frontend
    const publicPath = `/uploads/covers/${coverName}`;
    return publicPath;
    }
  
    throw new Error("Arquivo inválido");
};