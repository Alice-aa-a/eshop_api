import express from "express"
// import UserRoutes from "./api/user.js"
// import AuthRoutes from "./api/auth.js"
// import passport from "passport";
import ProductRoutes from "./api/product"

const router = express.Router();

// router.use("/comment", passport.authenticate("jwt", {session: false}),UserRoutes)
// router.use("/users", passport.authenticate("jwt", {session: false}),UserRoutes)
// router.use("/articles", passport.authenticate("jwt", {session: false}),ArticleRoutes)
router.use("/products", ProductRoutes)
// router.use("/auth", AuthRoutes)
export default router;