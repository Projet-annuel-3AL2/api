import express from "express";
import { PostController } from "../controllers/post.controller";
import {Post} from "../models/post.model";

const postRouter = express.Router();

postRouter.get('/', async (req, res) =>{
    const postController = await PostController.getInstance();
})


export {
    postRouter
}
