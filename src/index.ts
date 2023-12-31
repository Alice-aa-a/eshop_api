import express from "express";
import prisma from "./utils/database";
import api from "./routes/api";
import { rateLimit } from 'express-rate-limit';
import 'dotenv/config'
import './utils/passport';
import passport from "passport";
import 'dotenv/config';
import {errorHandler} from "./utils/middleware";
import cors from 'cors';
import helmet from 'helmet';

async function main() {
    const app = express()
    app.use(passport.initialize());
    app.get("/", (req, res) => {
        res.send("Bienvenue !");
    });
    app.get(
        "/protected",
        passport.authenticate("jwt", { session: false }),
        (req, res) => {
            console.log(req.user);
            res.send("Vous êtes bien connecté !");
        }
    );
    const port = 3000
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 300,
        standardHeaders: true,
        legacyHeaders: false,
    })
    app.use(limiter)
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use("/api", api);
    app.use(errorHandler);
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
