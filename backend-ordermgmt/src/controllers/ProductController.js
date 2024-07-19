import { ProductMapper } from "../mapper/ProductMapper.js";
import { ProductService } from "../services/ProductService.js";

export class ProductController {
    async getProducts(req, res) {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const offset = pageSize * (page - 1);
        const orderBy = req.query.orderBy ? req.query.orderBy : 'name';
        const orderDir = req.query.orderDir == 'asc' ? 1 : -1;
        const search = req.query.search ? req.query.search : '';
        const productService = new ProductService();
        const products = await productService.getProducts(search, pageSize, offset, orderDir, orderBy);
        const dtos = new ProductMapper().listMapper(products.data);
        res.setHeader('x-count', products.count);
        return res.status(200).send(dtos);
    }
}