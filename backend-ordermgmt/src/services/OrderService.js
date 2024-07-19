import mongoose from "mongoose";
import { Order } from "../models/Orders.js";
import { GeneralService } from "./GeneralService.js";

export class OrderService extends GeneralService {
    orderModel;
    constructor() {
        const orderModel = mongoose.models.Order || new Order().orderModel();
        super(orderModel);
        this.orderModel = orderModel;
    }

    async postOrder(model) {
        return this.insert(model);
    }

    async getOrders(search, pageSize, offset, orderDir, orderBy) {
        return await this.getLists(search, pageSize, offset, orderDir, orderBy);
    }

}