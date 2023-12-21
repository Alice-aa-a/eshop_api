import express, { Request, Response } from 'express';
import {User} from "../../classes/user";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    // http://127.0.0.1:3000/api/users/
    try {
        const users: User[] = await User.getAllUsers();
        return res.status(200).send(users);
    } catch (e) {
        console.error("Error fetching products:", e);
        res.status(500).send('Internal server error');
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await User.getUser(userId);
        return res.status(200).send(user);
    } catch (e) {
        console.error("Error fetching users:", e);
        res.status(500).send('Internal server error');
    }
});

router.post("/", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await User.createUser(name, email, password);
        return res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.put("/:id", async (req, res) => {
    const { name, email, password, active } = req.body;
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await User.updateUser(userId, name, email, password, active);
        return res.status(200).send(user);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
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
