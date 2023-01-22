import { spawn } from 'child_process';
import * as fs from 'fs';
const child_process = require('child_process');

class imageService {
    constructor() {

    } 

    /*
    async process() {
        const imagesFolder = 'images/';

        const imageFiles = fs.readdirSync(imagesFolder)
            .filter((file) => file.endsWith('.jpg'))
            .sort((a, b) => fs.statSync(`${imagesFolder}/${a}`).ctime.getTime() - fs.statSync(`${imagesFolder}/${b}`).ctime.getTime());

        const recentImages = imageFiles.slice(-imageFiles.length);

        for (let i = 0; i < recentImages.length; i += 2) {
            const image1 = recentImages[i];
            const image2 = recentImages[i + 1];

        Jimp.read(`${imagesFolder}/${image1}`)
          .then((image1) => Jimp.read(`${imagesFolder}/${image2}`)
          .then((image2) => {
              const newImage = new Jimp(image1.bitmap.width * 2, image1.bitmap.height);
              newImage.composite(image1, 0, 0);
              newImage.composite(image2, image1.bitmap.width, 0);
              newImage.write(`results/new_image${i}.jpg`);
          }))
        .catch((err) => console.error(err));

      }
       

    }
    */
   async process(scriptPath: string) {
    const pythonProcess = spawn('python3', [scriptPath]);

    // Log any output from the Python script
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // Handle any errors that occur
    pythonProcess.on('error', (error) => {
        console.error(`error: ${error}`);
    });

    // Exit the process when the Python script is done
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
   }

}

const service=new imageService();
export default service;