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
}