import express, { Request, Response } from 'express';
import {Orderproduct} from "../../classes/orderproduct";
import {authorizeRole} from "../../utils/middleware";
import { Roleuser } from '@prisma/client';

const router = express.Router();

router.get("/", authorizeRole([Roleuser.GESTIONNAIRE, Roleuser.ADMINISTRATEUR]), async (req: Request, res: Response) => {
    // http://127.0.0.1:3000/api/orderproducts/
    try {
        const orderproducts: Orderproduct[] = await Orderproduct.getAllOrderProducts();
        return res.status(200).send(orderproducts);
    } catch (e) {
        console.error("Error fetching products:", e);
        res.status(500).send('Internal server error');
    }
});

router.get("/:orderId/:productId", authorizeRole([Roleuser.CLIENT, Roleuser.GESTIONNAIRE, Roleuser.ADMINISTRATEUR]), async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.orderId, 10);
        const productId = parseInt(req.params.productId, 10);
        const orderproduct= await Orderproduct.getOrderProduct(orderId,productId);
        return res.status(200).send(orderproduct);
    } catch (e) {
        console.error("Error fetching products:", e);
        res.status(500).send('Internal server error');
    }
});

router.post("/", authorizeRole([Roleuser.CLIENT, Roleuser.GESTIONNAIRE, Roleuser.ADMINISTRATEUR]), async (req, res) => {
    const { orderId, productId, quantity } = req.body;
    try {
        const newOrderproduct = await Orderproduct.createOrderProduct(orderId, productId, quantity);
        return res.status(201).send(newOrderproduct);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.put("/:orderId/:productId", authorizeRole([Roleuser.CLIENT, Roleuser.GESTIONNAIRE, Roleuser.ADMINISTRATEUR]), async (req, res) => {
    const { orderId, productId, quantity } = req.body;
    try {
        const orderproduct = await Orderproduct.updateOrderProduct(orderId, productId, quantity);
        return res.status(200).send(orderproduct);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.delete("/:orderId/:productId", authorizeRole([Roleuser.CLIENT, Roleuser.GESTIONNAIRE, Roleuser.ADMINISTRATEUR]), async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.orderId, 10);
        const productId = parseInt(req.params.productId, 10);
        await Orderproduct.deleteOrderproduct(orderId, productId);
        return res.status(204).send();
    } catch (e) {
        console.error("Error deleting product:", e);
        res.status(500).send('Internal server error');
    }
});


export default router;
