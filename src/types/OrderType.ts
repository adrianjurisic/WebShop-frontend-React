import CartType from "./CartType";

export default interface OrderType {
    orderId: number;
    createdAt: string;
    status: string;
    cart: CartType;
}