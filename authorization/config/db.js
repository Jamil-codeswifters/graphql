const { default: mongoose, model } = require("mongoose")
const dotenv = require('dotenv')
dotenv.config()
const connectDb = async () => {
    try {

        const res = await mongoose.connect(process.env.MONOGO_URI)
        console.log(res.connection.host)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDb