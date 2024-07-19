import express from 'express';
import http from 'http';
import { initMongodb } from './src/connection/dbconnection.js';
import { asyncHandler } from './src/common/asyncHandler.js';
import { ProductController } from './src/controllers/ProductController.js';
import { config } from 'dotenv';
import { OrderController } from './src/controllers/OrderController.js';
import cors from 'cors';

const app = express();
const router = express.Router();
const server = http.createServer(app);
config({ path: './.env' });

initMongodb();
app.use(cors({ exposedHeaders: "*", allowedHeaders: "*", origin: "*", methods: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get('/products', asyncHandler((req, res) => {
    return new ProductController().getProducts(req, res);
}))

router.get('/orders', asyncHandler((req, res) => {
    return new OrderController().getOrders(req, res);
}))

router.post('/orders', asyncHandler((req, res) => {
    return new OrderController().postProductOrder(req, res);
}))

app.use('/', router);

app.use((err, req, res, next) => {
    console.log('Custom Error Handler ', err);
    return res.status(500).send({ message: 'Internal Server Error.' });
})

server.listen(process.env.APP_PORT, () => { console.log(`Listening on port ${process.env.APP_PORT}.`) })