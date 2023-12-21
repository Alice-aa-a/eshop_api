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
    public static async getProduct(productId: number): Promise<Product | null> {
        try {
            const existingProduct = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });
            if (existingProduct) {
                return {
                    id: existingProduct.id,
                    name: existingProduct.name,
                    price: existingProduct.price
                };
            } else {
                console.error(`Product with ID ${productId} not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error("Failed to create product");
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
    public static async updateProduct(id: number, name: string, price: number): Promise<Product | null> {
        try {
            const existingProduct = await prisma.product.findUnique({
                where: {
                    id: id,
                },
            });
            if (existingProduct) {
                const updatedProduct = await prisma.product.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: name,
                        price: price,
                    },
                });
                return {
                    id: updatedProduct.id,
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                };
            } else {
                console.error(`Product with ID ${id} not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error updating product:", error);
            throw new Error("Failed to update product");
        }
    }

    public static async deleteProduct(productId: number): Promise<void> {
        try {
            const product = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });
            if (product) {
                await prisma.product.delete({
                    where: {
                        id: product.id,
                    },
                });
            } else {
                console.error(`Product with ID ${productId} not found.`);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            throw new Error("Failed to delete product");
        }
    }
}
