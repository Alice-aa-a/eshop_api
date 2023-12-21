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
    public static async createProduct(name: string, price: number): Promise<Product> {
        try {
            const newProduct = await prisma.product.create(
                {
                    data: {
                        name: name,
                        price: price,
                    }
                });
            return {
                id: newProduct.id,
                name: newProduct.name,
                price: newProduct.price,
            };
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error("Failed to create product");
        }
    }
}
