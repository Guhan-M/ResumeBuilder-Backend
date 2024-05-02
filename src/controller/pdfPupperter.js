import puppeteer from 'puppeteer';
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
        // https://6633230b8834dd00081dce9e--resumebuildergm.netlify.app/ResumetoPdf/662f3da19d52c458eb0a1310
        // https://6633255474ab68000812ec08--resumebuildergm.netlify.app/ResumetoPdf/662f3da19d52c458eb0a1310
        const link = ` https://6633255474ab68000812ec08--resumebuildergm.netlify.app/ResumetoPdf/${req.body.id}`;
        // const link = `http://localhost:5173/ResumetoPdf/${req.body.id}`;
        if (!req.body) {
            return res.status(404).send({ message: "Data not found" });
        }

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
        page.on('error', err => {
            console.error('Page error:', err);
            browser.close();
            res.status(500).send({ message: 'An error occurred while generating PDF' });
        });

        page.on('pageerror', err => {
            console.error('Page error:', err);
            browser.close();
            res.status(500).send({ message: 'An error occurred while generating PDF' });
        });

        await page.goto(link, { waitUntil: "networkidle2" });
        await page.waitForFunction(() => {
            const images = document.querySelectorAll('img');
            return Array.from(images).every((img) => img.complete);
        });
      
        await page.setViewport({ width: 1080, height: 1024 });
        await page.pdf({ path: filenames, format: "A4", printBackground: true });
        await browser.close();

        console.log('PDF generated successfully:', sendfilename);
        res.status(201).send({ message: 'File successfully', sendfilename });
           
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send({ message: err.message });
    }
}

export default generatepdf;





// import puppeteer from 'puppeteer';
// import path from 'path';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const generatepdf = async (req, res) => {
//     console.log(req.body.id);
//     try {
//         const sendfilename = `output_${Date.now()}.pdf`
//         const filenames = path.join(__dirname, `/output/${sendfilename}`);
//         const link = `http://localhost:5173/ResumetoPdf/${req.body.id}`;
      
//         if (req.body) {
//             const browser = await puppeteer.launch({
//                 headless: 'new',
//                 args: [
//                     '--disable-gpu',
//                     '--no-sandbox',
//                     '--disable-web-security',
//                     '--disable-dev-profile',
//                     '--aggressive-cache-discard',
//                     '--disable-cache',
//                     '--disable-application-cache',
//                     '--disable-offline-load-stale-cache',
//                     '--disable-gpu-shader-disk-cache',
//                     '--media-cache-size=0',
//                     '--disk-cache-size=0'
//                 ],
//                 protocolTimeout: 120000
//             });

//             const page = await browser.newPage();
//             await page.goto(link, { waitUntil: "networkidle2" });
            
//             await page.waitForFunction(() => {
//                 const images = document.querySelectorAll('img');
//                 return Array.from(images).every((img) => img.complete);
//             });
          
//             await page.setViewport({ width: 1080, height: 1024 });
//             await page.pdf({ path: filenames, format: "A4", printBackground: true });
//             await browser.close();

//             res.status(201).send({ message: 'File successfully', sendfilename });
           
//         } else {
//             return res.status(404).send({ message: "data not found" });
//         }
//     } catch (err) {
//         res.status(500).send({ message: err.message });
//     }
// }

// export default generatepdf;
