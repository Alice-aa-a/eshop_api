import express, { Request, Response } from 'express';
import {Order} from "../../classes/order";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    // http://127.0.0.1:3000/api/orders/
    try {
        const orders: Order[] = await Order.getAllOrders();
        return res.status(200).send(orders);
    } catch (e) {
        console.error("Error fetching products:", e);
        res.status(500).send('Internal server error');
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id, 10);
        const order = await Order.getOrder(orderId);
        return res.status(200).send(order);
    } catch (e) {
        console.error("Error fetching users:", e);
        res.status(500).send('Internal server error');
    }
});

router.post("/", async (req, res) => {
    const { title, userId } = req.body;
    try {
        const newOrder = await Order.createOrder(title, userId);
        return res.status(201).send(newOrder);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.put("/:id", async (req, res) => {
    const { title, userId } = req.body;
    try {
        const orderId = parseInt(req.params.id, 10);
        await Order.updateOrderDatails(orderId, title, userId);
        return res.status(200).send();
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10);
        await Order.deleteOrder(userId);
        return res.status(204).send();
    } catch (e) {
        console.error("Error deleting user:", e);
        res.status(500).send('Internal server error');
    }
});


export default router;
