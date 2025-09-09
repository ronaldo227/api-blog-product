import express, { Router } from 'express';
import * as adminController from '../controllers/admin';
import { privateRoute } from '../middlewares/private-route';
import { upload } from '@/libs/multer';

//  Arquivo: src/routes/admin.ts
// Rotas administrativas (protegidas por JWT)

// Cria o router
export const adminRoutes = Router();

//Routes de admin

adminRoutes.post('/posts', privateRoute, upload.single('cover'), adminController.addPost);
//adminRoutes.get('/posts', adminController.getAllPosts);
//adminRoutes.get('/posts/:slug ', adminController.getPost);
//adminRoutes.put('/posts/:slug ', adminController.editePost);
//adminRoutes.delete('/posts/:slug  ', adminController.deletePost);