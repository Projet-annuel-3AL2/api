import express from "express";
import {UserController} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", async function (req, res) {
    const userController = await UserController.getInstance();
    res.json(await userController.getAll());
});

userRouter.get("/:id", async function (req, res) {
    const id = req.params.id;
    if(id === undefined){
        res.status(400).end();
    }
    const userController = await UserController.getInstance();
    const user = await userController.getById(id);
    if(!user){
        res.status(404).end();
    }
    res.json(user);
});

export {
    userRouter
};
