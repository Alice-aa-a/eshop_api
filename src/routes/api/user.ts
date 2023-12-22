import express, { Request, Response } from 'express';
import {User} from "../../classes/user";
import {validateAuthInputs, authorizeRole} from "../../utils/middleware";
import { Roleuser } from '@prisma/client';

const router = express.Router();

router.get("/", authorizeRole([Roleuser.ADMINISTRATEUR]),async (req: Request, res: Response) => {
    // http://127.0.0.1:3000/api/users/
    try {
        const users: User[] = await User.getAllUsers();
        return res.status(200).send(users);
    } catch (e) {
        console.error("Error fetching products:", e);
        res.status(500).send('Internal server error');
    }
});

router.get("/:id", authorizeRole([Roleuser.ADMINISTRATEUR]), async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await User.getUser(userId);
        return res.status(200).send(user);
    } catch (e) {
        console.error("Error fetching users:", e);
        res.status(500).send('Internal server error');
    }
});

router.post("/", validateAuthInputs, async (req: Request, res: Response) => {
    const { name, email, password, roleuser } = req.body;
    try {
        const newUser = await User.createUser(name, email, password, roleuser);
        return res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.put("/:id", validateAuthInputs, async (req: Request, res: Response) => {
    const { name, email, password, active, roleuser } = req.body;
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await User.updateUser(userId, name, email, password, active, roleuser);
        return res.status(200).send(user);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.delete("/:id", authorizeRole([Roleuser.ADMINISTRATEUR]), async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10);
        await User.deleteUser(userId);
        return res.status(204).send();
    } catch (e) {
        console.error("Error deleting user:", e);
        res.status(500).send('Internal server error');
    }
});


export default router;
