import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import Approutes from './src/routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(Approutes);

// Endpoint to serve static images
app.get('/images/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, 'src', 'images', filename);
        // Check if the file exists
        // If it does, send the file
        // Otherwise, return a 404 Not Found error
        res.sendFile(filepath, (err) => {
            if (err) {
                res.status(404).send({
                    message: "File not found"
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal server error"
        });
    }
});

app.get('/pdf/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, 'src', 'controller','output', filename);
        // Check if the file exists
        // If it does, send the file
        // Otherwise, return a 404 Not Found error
        res.sendFile(filepath, (err) => {
            if (err) {
                res.status(404).send({
                    message: "File not found"
                });
            }
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal server error"
        });
    }
});


const PORT = process.env.PORT || 3000; // Default port is 3000 if not specified in .env file
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
