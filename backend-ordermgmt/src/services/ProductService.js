import mongoose from "mongoose";
import { Products } from "../models/Products.js";
import { GeneralService } from "./GeneralService.js";

export class ProductService extends GeneralService {
    productModel;
    constructor() {
        const productModel = mongoose.models.Product || new Products().productModel();
        super(productModel);
    }

    async getProducts(search, pageSize, offset, orderDir, orderBy) {
        return await this.getLists(search, pageSize, offset, orderDir, orderBy);
    }

}