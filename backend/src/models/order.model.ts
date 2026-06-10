import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: String;
    price: number;
    quantity: number;
    image: string;
}