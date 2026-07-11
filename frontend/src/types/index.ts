export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    createdBy: string;
    createdAt: string;
}

export interface OrderItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalPrice: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    shippingAdress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    createdAt: string;
}