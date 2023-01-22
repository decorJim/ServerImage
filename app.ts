const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
import service from "./imageService";
const path = require('path');


const app=express();

app.set('PORT',process.env.PORT || 8080);

app.use((req: any, res: { header: (arg0: string, arg1: string) => void; }, next: () => void) => {   // must be here to make http request work without access problems
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'image/jpg', limit:"50mb" }))
app.use(express.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const upload=multer({ 
    dest:"images/",
    limits:{fieldSize: 100 * 1024 * 1024},
});

app.post('/images',upload.single("image"), async (req: { body: { data: string; image: any; }; },res: { json: (arg0: { id: string; msg: number; state: string; }) => any; })=>{
    console.log("RECEIVED");
    let obj=JSON.parse(req.body.data);
    console.log(obj.limit);

    let timestamp = Date.now();
    const binaryData = Buffer.from(req.body.image as any, 'base64');
    console.log(binaryData)
    fs.writeFileSync(`images/image-${timestamp}.jpg`, binaryData);

    const imagesFolder = 'images/';
    const imageFiles = fs.readdirSync(imagesFolder).filter((file: string) => file.endsWith('.jpg'));
    
    let num:number=imageFiles.length;

    const jsonObj={
        "id":"78giug87t56ertfhg",
        "msg":num,
        "state":"ongoing"
    }

    if(imageFiles.length==obj.limit as number) {
        service.process("script.py");
    }
    return res.json(jsonObj)
})

app.post('/image',upload.single("image"), async (req: { headers: any; body: { data: any; image: any; }; },res: any)=>{
    console.log(req.headers)
    console.log(req.body.data)

    let timestamp = Date.now();
    const binaryData = Buffer.from(req.body.image as any, 'base64');
    console.log(binaryData)
    fs.writeFileSync(`images/image-${timestamp}.jpg`, binaryData);
})

app.get('/results',(req: any,res: { send: (arg0: string[]) => void; })=>{
    const imagesFolder = 'results/';
    const imageFiles = fs.readdirSync(imagesFolder).filter((file: string) => file.endsWith('.jpg'));
    const images = [];
    for (let i = 0; i < imageFiles.length; i++) {
        const file = fs.readFileSync(`${imagesFolder}/${imageFiles[i]}`);
        const base64 = Buffer.from(file).toString('base64');
        images.push(base64);
    }
    res.send(images);
})

app.post('/delete',(req: any,res: { json: (arg0: { msg: string; }) => void; })=>{
    const imagesFolder = 'images/';
    const resultsFolder = 'results/';

    // Delete all files in the images folder
    fs.readdir(imagesFolder, (err: any, files: any) => {
        if (err) throw err;
        for (const file of files) {
           fs.unlink(path.join(imagesFolder, file), (err: any) => {
               if (err) throw err;
           });
        }
    });

    // Delete all files in the results folder
    fs.readdir(resultsFolder, (err: any, files: any) => {
       if (err) throw err;
          for (const file of files) {
             fs.unlink(path.join(resultsFolder, file), (err: any) => {
               if (err) throw err;
              });
          }
    });
    const jsonObj={
        "msg":"deleted sucess !"
    }
    res.json(jsonObj);
})

const server = http.createServer(app);

server.listen(process.env.PORT || 8080,()=>{
    console.log(`Server is running localhost:${app.get('PORT')}`);
});


