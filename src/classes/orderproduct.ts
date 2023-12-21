import prisma from '../utils/database';

export class Orderproduct {
    orderId: number;
    productId: number;
    quantity: number;

    constructor(orderId: number, productId: number, quantity: number) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
    }
    public static async getAllOrderProducts(): Promise<Orderproduct[]> {
        try {
            const orderProducts = await prisma.orderProduct.findMany();
            return orderProducts.map((orderProduct) => ({
                orderId: orderProduct.orderId,
                productId: orderProduct.productId,
                quantity: orderProduct.quantity
            }));
        } catch (error) {
            console.error("Error fetching orderProduct:", error);
            throw new Error("Failed to fetch orderProduct");
        }
    }
    public static async getOrderProduct(orderId: number, productId: number): Promise<Orderproduct | null> {
        try {
            const existingOrderProduct = await prisma.orderProduct.findUnique({
                where: {
                    orderId_productId: {
                        orderId,
                        productId,
                    },
                    },
            });
            if (existingOrderProduct) {
                return {
                    orderId: existingOrderProduct.orderId,
                    productId: existingOrderProduct.productId,
                    quantity: existingOrderProduct.quantity
                };
            } else {
                console.error(`orderProduct id not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error fetching orderproduct:", error);
            throw new Error("Failed to fetch orderproduct");
        }
    }
    public static async createOrderProduct(orderId: number, productId: number, quantity: number): Promise<Orderproduct> {
        try {
            return await prisma.orderProduct.create(
                {
                    data: {
                        orderId: orderId,
                        productId: productId,
                        quantity: quantity,
                    }
                });
        } catch (error) {
            console.error("Error creating orderProduct:", error);
            throw new Error("Failed to create orderProduct");
        }
    }
    public static async updateOrderProduct(orderId: number, productId: number, quantity: number): Promise<Orderproduct | null> {
        try {
            const existingOrderProduct = await prisma.orderProduct.findUnique({
                where: {
                    orderId_productId: {
                        orderId,
                        productId,
                    },
                },
            });
            if (existingOrderProduct) {
                const updatedOrderProduct = await prisma.orderProduct.update({
                    where: {
                        orderId_productId: {
                            orderId,
                            productId,
                        },
                    },
                    data: {
                        orderId: orderId,
                        productId: productId,
                        quantity: quantity,
                    },
                });
                return {
                    orderId: updatedOrderProduct.orderId,
                    productId: updatedOrderProduct.productId,
                    quantity: updatedOrderProduct.quantity,
                };
            } else {
                console.error(` ID not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error updating orderProduct:", error);
            throw new Error("Failed to update orderProduct");
        }
    }
    public static async deleteOrderproduct(orderId: number, productId: number): Promise<void> {
        try {
            const product = await prisma.orderProduct.findUnique({
                where: {
                    orderId_productId: {
                        orderId,
                        productId,
                    },
                },
            });
            if (product) {
                await prisma.orderProduct.delete({
                    where: {
                        orderId_productId: {
                            orderId,
                            productId,
                        },
                    },
                });
            } else {
                console.error(`ID not found.`);
            }
        } catch (error) {
            console.error("Error deleting orderProduct:", error);
            throw new Error("Failed to delete orderProduct");
        }
    }
}