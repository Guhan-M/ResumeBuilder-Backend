import fs from 'fs';
import puppeteer from 'puppeteer';
const outputPath = "./output";
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generatepdf = async (req, res) => {
    console.log(req.body.id);
    try {
        const sendfilename = `output_${Date.now()}.pdf`
        const filenames = path.join(__dirname, `/output/${sendfilename}`);
        const link = `https://66311e1aae2554000809bcbb--resumebuildergm.netlify.app/ResumetoPdf/${req.body.id}`;
      
        if (req.body) {
            const browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--disable-gpu',
                    '--no-sandbox',
                    '--disable-web-security',
                    '--disable-dev-profile',
                    '--aggressive-cache-discard',
                    '--disable-cache',
                    '--disable-application-cache',
                    '--disable-offline-load-stale-cache',
                    '--disable-gpu-shader-disk-cache',
                    '--media-cache-size=0',
                    '--disk-cache-size=0'
                ],
                protocolTimeout: 120000
            });

            const page = await browser.newPage();
            await page.goto(link, { waitUntil: "networkidle2" });
            
            await page.waitForFunction(() => {
                const images = document.querySelectorAll('img');
                return Array.from(images).every((img) => img.complete);
            });
          
            await page.setViewport({ width: 1080, height: 1024 });
            await page.pdf({ path: filenames, format: "A4", printBackground: true });
            await browser.close();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
            res.status(201).send({ message: 'File successfully', sendfilename });
           
        } else {
            return res.status(404).send({ message: "data not found" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export default generatepdf;
