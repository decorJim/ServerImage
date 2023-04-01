import { spawn } from 'child_process';
const fs = require('fs');
const execFile = require('child_process').execFile;

class imageService {
    processImage(arg0: string) {
        throw new Error("Method not implemented.");
    }
    
    images:Map<String,Buffer>=new Map<String,Buffer>();

    constructor() {
        const folderPath = 'images';
        const resultsPath = 'results';
        if (!fs.existsSync(folderPath)) {
           fs.mkdirSync(folderPath);
        }
        if (!fs.existsSync(resultsPath)) {
            fs.mkdirSync(resultsPath);
        }
        
    } 

   async process(scriptPath: string) {
    // NOTICE DEPENDING ON PYTHON COMMAND ON YOUR PC, MIGHT HAVE TO CHANGE TO python3
    const pythonProcess = spawn('python', [scriptPath]);

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

   async processImages(scriptPath: string,imageBuffers:Buffer[]) {
      for (let i = 0; i < imageBuffers.length; i += 2) {
        let img1 = imageBuffers[i];
        let img2 = imageBuffers[i + 1];
        if(!img2) img2 = img1;
    
        // Pass the two images as arguments to the Python script
        let args = [scriptPath, img1, img2];
    
        execFile('python3', args, (error: any, stdout: any, stderr: any) => {
          if (error) {
            //console.error(`error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        });
      }
   }

}

const service=new imageService();
export default service;