import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: String;
    price: number;
    quantity: number;
    image: string;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
    shippingAderess: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
}