import { RequestHandler } from "express";

export const addPost: RequestHandler = (req, res) => {
    // Lógica para adicionar um post
    const response = { message: 'Post adicionado com sucesso!' };
    res.status(201).json(response);
}