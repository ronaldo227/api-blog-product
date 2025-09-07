import express, { Router } from 'express';
import * as adminController from '../controllers/admin';

export const adminRoutes = Router();

//Routes de admin

adminRoutes.post('/posts', adminController.addPost);
//adminRoutes.get('/posts', adminController.getAllPosts);
//adminRoutes.get('/posts/:slug ', adminController.getPost);
//adminRoutes.put('/posts/:slug ', adminController.editePost);
//adminRoutes.delete('/posts/:slug  ', adminController.deletePost);