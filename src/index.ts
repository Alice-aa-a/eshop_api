import express from "express";
import prisma from "./utils/database";
import api from "./routes/api";
import { rateLimit } from 'express-rate-limit';
import 'dotenv/config'
import './utils/passport.js';
import passport from "passport";

const app = express()
const port = 3000
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
})

// Apply the rate limiting middleware to all requests.
async function main() {
    app.use(passport.initialize());
    app.get(
        "/protected",
        passport.authenticate("jwt", { session: false }),
        (req, res) => {
            console.log(req.user);
            res.send("Vous êtes bien connecté !");
        }
    );
    app.use(limiter)
    app.use(express.json());
    app.use("/api", api);
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
