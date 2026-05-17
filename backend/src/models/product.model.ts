import mongoose, { Document, Schema } from 'mongoose';

export interface Iproduct extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    createdBy: mongoose.Types.ObjectId;
}