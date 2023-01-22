import { spawn } from 'child_process';
import * as fs from 'fs';
const child_process = require('child_process');

class imageService {
    constructor() {

    } 
    
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