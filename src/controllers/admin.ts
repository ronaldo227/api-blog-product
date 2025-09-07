import { RequestHandler } from "express";

export const addPost: RequestHandler = (req, res) => {
    console.log('📝 SUPER DEBUG ADMIN - Add post request:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers,
        query: req.query,
        params: req.params,
        ip: req.ip
    });
    
    // Lógica para adicionar um post
    console.log('📝 SUPER DEBUG ADMIN - Processing add post...');
    
    const response = { message: 'Post adicionado com sucesso!' };
    
    console.log('📝 SUPER DEBUG ADMIN - Add post response:', response);
    
    res.status(201).json(response);
}