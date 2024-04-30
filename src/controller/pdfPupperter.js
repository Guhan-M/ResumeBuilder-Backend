import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = "./output";

const generatepdf = async (req, res) => {
    console.log(req.body.id);
    try {
        const filenames = path.join(__dirname, `${outputPath}/output_${Date.now()}.pdf`);
        const link = `https://6630fe4c920bff1103caaec2--resumebuildergm.netlify.app/ResumetoPdf/${req.body.id}`;
        
        const browser = await puppeteer.launch({
            headless: true, // Change to false for debugging
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu'
            ]
        });
        
        const page = await browser.newPage();
        await page.goto(link, { waitUntil: "networkidle2" });
        
        await page.waitForFunction(() => {
            const images = document.querySelectorAll('img');
            return Array.from(images).every((img) => img.complete);
        });
        
        console.log("PDF generation started...");
        
        await page.pdf({ path: filenames, format: "A4", printBackground: true });
        
        console.log("PDF generated successfully:", filenames);
        
        await browser.close();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
        res.sendFile(filenames);
    } catch (err) {
        console.error("Error generating PDF:", err);
        res.status(500).send({ message: err.message });
    }
};

export default generatepdf;
