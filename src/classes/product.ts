import prisma from '../utils/database';

export class Product {
    id: number;
    name: string;
    price: number;

    constructor(id: number, name: string, price: number) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    // Static method to fetch all products
    public static async getAllProducts(): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany();
            return products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price
            }));
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error("Failed to fetch products");
        }
    }
}
