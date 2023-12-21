import express from "express";
import prisma from "./utils/database";
import api from "./routes/api";

const app = express()
const port = 3000

async function main() {
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
