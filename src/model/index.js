import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config() /*  load environment variables from a .env file into the Node.js process */

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)


export default mongoose