import { Schema, model } from 'mongoose';

export class Order {
    orderModel() {
        return model('Order', new Schema({
            customerName: {
                type: String,
                required: true,
            },
            packages: [
                {
                    packageName: {
                        type: String,
                        required: true
                    },
                    products: [
                        {
                            productId: {
                                type: Schema.Types.ObjectId,
                                required: true,
                                ref: 'Product'
                            },
                            weight: {
                                type: Number,
                            },
                            price: {
                                type: Number
                            }
                        }],
                    totalWeight: {
                        type: Number,
                        required: true
                    },
                    totalPrice: {
                        type: Number,
                        required: true
                    },
                    courierPrice: {
                        type: Number,
                        required: true
                    }
                }
            ],
            orderDate: {
                type: Date,
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
};
