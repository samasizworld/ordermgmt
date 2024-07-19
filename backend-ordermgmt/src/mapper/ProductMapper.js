export class ProductMapper{
    listMapper(models){
        return models.map(m=>{
            return {
                ProductId:m._id,
                Name:m.name,
                Price:m.price,
                Weight:m.weight,
                Datecreated:m.datecreated,
                Datemodified:m.datemodfied
            }
        })
    }
}