
export class GeneralService {
    model;
    constructor(model) {
        this.model = model;
    }

    async getLists(search, pageSize, offset, orderDir, orderBy) {
        let searchQuery = {};
        let result={};
        if (search) {
            searchQuery = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                ]
            }
        }
        if (pageSize == 0) {
            result.data = await this.model.find(searchQuery).sort({ [orderBy]: orderDir });
        } else {
            result.data = await this.model.find(searchQuery).sort({ [orderBy]: orderDir }).skip(offset).limit(pageSize);
        }
        result.count = await this.model.countDocuments(searchQuery);

        return result;
    }


    async getDetailById(id) {
        return await this.model.productModel().findById(id);
    }

    async insert(model) {
        return await this.model.create(model);
    }

    async updateById(id, model) {
        return await this.model.findByIdAndUpdate(id, model, { new: true, runValidators: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}