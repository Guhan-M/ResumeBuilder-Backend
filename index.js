import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import Approutes from './src/routes/index.js'
import { fileURLToPath } from 'url'; // Import the fileURLToPath function
import path  from 'path'
dotenv.config()

const __filename = fileURLToPath(import.meta.url); // Get the filename of the current module
const __dirname = path.dirname(__filename); // Get the directory name of the current module

const app = express()

app.use(cors())
app.use(express.json())
app.use(Approutes)

app.get('/images/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, 'images', filename);
        res.sendFile(filepath);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal server error"
        });
    }
  });

app.listen(process.env.PORT,()=>console.log("Server is listening in port " + process.env.PORT))
