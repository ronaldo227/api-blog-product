import { Router } from "express";
import * as mainController from '../controllers/main';


export const mainRoutes = Router();

// Rota de teste
mainRoutes.get('/ping', (req, res) => {
    res.json({ 
        message: "pong", 
        timestamp: new Date().toISOString(),
        status: "API funcionando"
    });
});

//Routes de posts
mainRoutes.get('/posts', mainController.getAllPosts);
mainRoutes.get('/posts/:slug', mainController.getPost);
mainRoutes.get('/posts/:slug/related', mainController.getRelatedPosts);