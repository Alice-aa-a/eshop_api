import prisma from '../utils/database';
import { Product } from './product';

export class Order {
    id: number;
    title: string;
    userId: number;
    OrderProduct: Product[];

    constructor(id: number, title: string, userId: number, products: Product[] = []) {
        this.id = id;
        this.title = title;
        this.userId = userId;
        this.OrderProduct = products;
    }

    public static async getAllOrders(): Promise<Order[]> {
        try {
            const orders = await prisma.order.findMany({
                include: {
                    OrderProduct: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            return orders.map((order) => ({
                id: order.id,
                title: order.title,
                userId: order.userId,
                OrderProduct: order.OrderProduct.map((orderProduct) => ({
                    id: orderProduct.product.id,
                    name: orderProduct.product.name,
                    price: orderProduct.product.price,
                })),
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Failed to fetch orders');
        }
    }
    public static async getOrder(orderId: number): Promise<Order | null> {
        try {
            const existingOrder = await prisma.order.findUnique({
                where: {
                    id: orderId,
                },
                include: {
                    OrderProduct: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            if (existingOrder) {
                return {
                    id: existingOrder.id,
                    title: existingOrder.title,
                    userId: existingOrder.userId,
                    OrderProduct: existingOrder.OrderProduct.map((orderProduct) => ({
                        id: orderProduct.product.id,
                        name: orderProduct.product.name,
                        price: orderProduct.product.price,
                    })),
                };
            } else {
                console.error(`Order with ID ${orderId} not found.`);
                return null;
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Failed to fetch orders');
        }
    }
    public static async createOrder(title: string, userId: number): Promise<Order> {
        try {
            const newOrder = await prisma.order.create(
                {
                    data: {
                        title: title,
                        userId: userId,
                    }
                });
            return {
                id: newOrder.id,
                title: newOrder.title,
                userId: newOrder.userId,
                OrderProduct: [],
            };
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error("Failed to create product");
        }
    }
    public static async updateOrderDatails(id: number, title: string, userId: number): Promise<void> {
        try {
            const existingOrder = await prisma.order.findUnique({
                where: {
                    id: id,
                },
            });
            if (existingOrder) {
                await prisma.order.update({
                    where: {
                        id: id,
                    },
                    data: {
                        title: title,
                        userId: userId,
                    },
                });
            } else {
                console.error(`Order with ID ${id} not found.`);
            }
        } catch (error) {
            console.error("Error updating order:", error);
            throw new Error("Failed to update order");
        }
    }
    public static async deleteOrder(orderId: number): Promise<void> {
        try {
            const order = await prisma.order.findUnique({
                where: {
                    id: orderId,
                },
            });
            if (order) {
                await prisma.order.delete({
                    where: {
                        id: order.id,
                    },
                });
            } else {
                console.error(`Order with ID ${orderId} not found.`);
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            throw new Error("Failed to delete order");
        }
    }
}
