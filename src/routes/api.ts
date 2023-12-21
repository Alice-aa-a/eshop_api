import express from "express"
import AuthRoutes from "./api/auth"
// import passport from "passport";
import ProductRoutes from "./api/product"
import OrderproductRoutes from "./api/orderproduct"
import UserRoutes from "./api/user"
import OrderRoutes from "./api/order"

const router = express.Router();

// router.use("/comment", passport.authenticate("jwt", {session: false}),UserRoutes)
// router.use("/users", passport.authenticate("jwt", {session: false}),UserRoutes)
// router.use("/articles", passport.authenticate("jwt", {session: false}),ArticleRoutes)
router.use("/products", ProductRoutes)
router.use("/users", UserRoutes)
router.use("/orders", OrderRoutes)
router.use("/orderproducts", OrderproductRoutes)
router.use("/auth", AuthRoutes)
export default router;