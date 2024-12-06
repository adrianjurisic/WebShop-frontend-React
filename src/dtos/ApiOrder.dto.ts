import CartType from "../types/CartType";

export default interface ApiOrderDto {
    orderId: number;
    createdAt: string;
    cartId: number;
    status: "rejected" | "accepted" | "shipped" | "pending";
    cart: CartType;
}