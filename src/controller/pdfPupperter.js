import puppeteer from 'puppeteer';
import { Buffer } from 'buffer'; // Import buffer module
import dotenv from "dotenv"

dotenv.config()

const generatepdf = async (req, res) => {
    console.log(req.body.id);
    try {
        const link = `https://main--resume-buildergm.netlify.app/ResumetoPdf/${req.body.id}`;
          console.log(link)
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
                 executablePath:
                process.env.NODE_ENV === "production"
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : puppeteer.executablePath(),
                protocolTimeout: 120000
            });
            //     executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
            //     protocolTimeout: 120000
            // });
            // const browser = await puppeteer.launch({
            //     headless: 'new',
            //     args: [
            //         '--disable-gpu',
            //         '--no-sandbox',
            //         '--disable-web-security',
            //         '--disable-dev-profile',
            //         '--aggressive-cache-discard',
            //         '--disable-cache',
            //         '--disable-application-cache',
            //         '--disable-offline-load-stale-cache',
            //         '--disable-gpu-shader-disk-cache',
            //         '--media-cache-size=0',
            //         '--disk-cache-size=0'
            //     ],
            //     executablePath:
            //     process.env.NODE_ENV === "production"
            //         ? process.env.PUPPETEER_EXECUTABLE_PATH
            //         : puppeteer.executablePath(),
            //     protocolTimeout: 120000
            // });
            
            const page = await browser.newPage();
            await page.goto(link, { waitUntil: "networkidle2" });
            
            await page.waitForFunction(() => {
                const images = document.querySelectorAll('img');
                return Array.from(images).every((img) => img.complete);
            });

          
            await page.setViewport({ width: 1080, height: 1024 });

            // Generate the PDF as a buffer
            const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

            // Convert binary buffer to base64 string
            const base64Pdf = pdfBuffer.toString('base64');

            await browser.close();
        
            res.status(201).send({ message: 'File successfully saved ',base64Pdf });
           
        } else {
            return res.status(404).send({ message: "data not found" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export default generatepdf;
