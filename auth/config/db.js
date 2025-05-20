import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const connectDb = async () => {
    try {
        const res =  await mongoose.connect(process.env.MONOGO_URI)
        console.log(res.connection.host)
    } catch (error) {
        console.log(error.message)

    }
}

export default connectDb