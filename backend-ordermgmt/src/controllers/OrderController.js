import { OrderMapper } from "../mapper/OrderMapper.js";
import { OrderService } from "../services/OrderService.js";
import { ProductService } from "../services/ProductService.js";

export class OrderController {
    async getOrders(req, res) {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const offset = pageSize * (page - 1);
        const orderBy = req.query.orderBy ? req.query.orderBy : 'name';
        const orderDir = req.query.orderDir == 'asc' ? 1 : -1;
        const search = req.query.search ? req.query.search : '';
        const orderService = new OrderService();
        const order = await orderService.getOrders(search, pageSize, offset, orderDir, orderBy);
        res.setHeader('x-count', order.count);
        return res.status(200).send(order.data);
    }

    async postProductOrder(req, res) {
        const productorders = req.body;
        const orderService = new OrderService();
        const productService = new ProductService();
        const productData = await productService.getProducts('', 0, 0, -1, 'name');
        const products = new OrderMapper().orderMapper(productorders, productData.data).sort((a, b) => (a.price - b.price));

        const packages = this.splitPackages(products);

        const order = await orderService.postOrder({ customerName: 'John Doe', packages, orderDate: new Date() });

        return res.status(201).send({ orderId: order._id });
    }

    splitPackages(products) {
        const packages = [];
        let currentPackage = { products: [], totalWeight: 0, totalPrice: 0, packageName: `` };

        products.forEach(product => {
            if (currentPackage.totalPrice + product.price > 250) {
                packages.push(currentPackage);
                currentPackage = { products: [], totalWeight: 0, totalPrice: 0, packageName: `` };
            }
            currentPackage.products.push(product);
            currentPackage.totalWeight += product.weight;
            currentPackage.totalPrice += product.price;
        });

        if (currentPackage.products.length > 0) {
            packages.push(currentPackage);
        }

        const pkgs = packages.map((pkg, index) => {
            let courierPrice;
            if (pkg.totalWeight > 0 && pkg.totalWeight < 200) {
                courierPrice = 5;
            } else if (pkg.totalWeight > 200 && pkg.totalWeight < 500) { courierPrice = 10 }
            else if (pkg.totalWeight > 500 && pkg.totalWeight < 1000) { courierPrice = 15 }
            else {
                courierPrice = 20
            }
            return { ...pkg, courierPrice, packageName: `Package ${index + 1}` }
        });

        return pkgs;

    }
}