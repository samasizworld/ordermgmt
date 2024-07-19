import { Schema, model } from 'mongoose';

export class Products {
    productModel() {
        return model('Product', new Schema({
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            weight: {
                type: Number,
                required: true
            },
            datecreated: {
                type: Date,
                default: Date.now
            },
            datemodified: {
                type: Date
            }
        }))
    }
}