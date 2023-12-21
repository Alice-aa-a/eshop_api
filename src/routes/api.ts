import express from "express"
import AuthRoutes from "./api/auth"
import ProductRoutes from "./api/product"
import OrderproductRoutes from "./api/orderproduct"
import UserRoutes from "./api/user"
import OrderRoutes from "./api/order"
import passport from "passport";

const router = express.Router();

router.use("/products", passport.authenticate('jwt', {session: false}), ProductRoutes)
router.use("/users", passport.authenticate('jwt', {session: false}), UserRoutes)
router.use("/orders", passport.authenticate('jwt', {session: false}), OrderRoutes)
router.use("/orderproducts", passport.authenticate('jwt', {session: false}), OrderproductRoutes)
router.use("/auth", AuthRoutes)
export default router;