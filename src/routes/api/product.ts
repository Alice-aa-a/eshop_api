import express, { Request, Response } from 'express';
import {Product} from "../../classes/product";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    // http://127.0.0.1:3000/api/products/
    try {
        const products: Product[] = await Product.getAllProducts();
        return res.status(200).send(products);
    } catch (e) {
        console.error("Error fetching products:", e);
        res.status(500).send('Internal server error');
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id, 10);
        const product= await Product.getProduct(productId);
        return res.status(200).send(product);
    } catch (e) {
        console.error("Error fetching products:", e);
        res.status(500).send('Internal server error');
    }
});

router.post("/", async (req, res) => {
    const { name, price } = req.body;
    try {
        const newProduct = await Product.createProduct(name, price);
        return res.status(201).send(newProduct);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.put("/:id", async (req, res) => {
    const { name, price } = req.body;
    try {
        const productId = parseInt(req.params.id, 10);
        const product = await Product.updateProduct(productId, name, price);
        return res.status(200).send(product);
    } catch (e) {
        res.status(500).send('Internal server error');
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id, 10);
        await Product.deleteProduct(productId);
        return res.status(204).send();
    } catch (e) {
        console.error("Error deleting product:", e);
        res.status(500).send('Internal server error');
    }
});


export default router;
