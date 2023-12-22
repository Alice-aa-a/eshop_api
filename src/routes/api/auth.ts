import {User} from "../../classes/user";
import bcrypt from "bcrypt";
import express, {Request, Response, Router} from "express";
import jwt from "jsonwebtoken";
import prisma from "../../utils/database";
import {validateAuthInputs} from "../../utils/middleware";

const router = express.Router();

router.get("/", (req, res) => {
    res.render('login');
});
router.post("/signin", validateAuthInputs, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(401).send({ error: "Invalid email or password" });
        }

        const isSamePassword = await bcrypt.compare(password, user.password);

        if (!isSamePassword) {
            return res.status(401).send({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user.id, roleuser: user.roleuser }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).send({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

router.post("/signup", validateAuthInputs, async (req: Request, res: Response) => {
    const { name, email, password, roleuser } = req.body;
    try {
        const newUser = await User.createUser(name, email, password, roleuser);
        return res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});
export default router;