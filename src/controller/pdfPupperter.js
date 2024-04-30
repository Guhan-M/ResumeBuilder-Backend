
import fs from 'fs'
import puppeteer from 'puppeteer';
const outputPath = "./output"
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const  generatepdf= async (req,res)=>{
    console.log(req.body.id)
    try{
        const  filenames=path.join(__dirname,`/output/output_${Date.now()}.pdf`)
        // `output_${Date.now()}.pdf`
        const link =`http://localhost:5173/ResumetoPdf/${req.body.id}`
        if(req.body){
      // Launch the browser and open a new blank page
    const browser=  await puppeteer.launch({
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
      })
        // const browser = await puppeteer.launch();
         const page = await browser.newPage();
        // Navigate the page to a URL
        await page.goto(link,{waitUntil:"networkidle2"});
        
        await page.waitForFunction(() => {
          const images = document.querySelectorAll('img');
          return Array.from(images).every((img) => img.complete);
        });
        console.log("Here")
        await page.setViewport({width: 1080, height: 1024});
 
        await page.pdf({path:filenames, format:"A4",printBackground:true})
        await browser.close();
        console.log(filenames)
        // res.download(filenames)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
        
        const fileStream = fs.readFileSync(filenames);
        // fileStream.pipe(res);
        res.sendFile(filenames)
        // res.status(201).send({ message: 'File  successfully', filenames });
        }
        else{
          return res.status(404).send({ message: "data  not found" });
        }
    }
    catch (err) {
      res.status(500).send({ message: err.message });
    }

}



export default generatepdf;


