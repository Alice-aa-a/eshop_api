import {User} from "../../classes/user";
import bcrypt from "bcrypt";
import express, {Router} from "express";
import jwt from "jsonwebtoken";
import prisma from "../../utils/database";

const router = express.Router();

router.get("/", (req, res) => {
    res.render('login');
});
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                password: password,
            },
        });
        if (!user) {
            return res.status(401).send({ error: "Invalid email or password" });
        }

        const isSamePassword = await bcrypt.compare(password, user.password);

        if (!isSamePassword) {
            return res.status(401).send({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).send({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await User.createUser(name, email, password);
        return res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});
export default router;