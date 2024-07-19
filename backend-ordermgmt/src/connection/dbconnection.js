import { connect } from "mongoose";
export const initMongodb = async () => {
    const mongoURL = process.env.MONGO_URI;
    try {
        await connect(mongoURL)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
    }

}
