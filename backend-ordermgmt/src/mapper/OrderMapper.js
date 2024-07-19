export class OrderMapper {
    orderMapper(dtos, products) {

        return dtos.map(d => {
            const matchProduct = products.find(p => p._id == d);
            return {
                productId: matchProduct._id,
                weight: matchProduct.weight,
                price: matchProduct.price
            }
        })
    }
}