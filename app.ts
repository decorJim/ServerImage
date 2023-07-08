const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
import { Request, Response } from "express";
import { uploadFile, uploadFiles } from "./firebase";
import service from "./imageService";
const path = require('path');


const app=express();

app.set('PORT',process.env.PORT || 80);

process.env.IP='52.60.42.240';

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
    //dest:"images/",
    limits:{fieldSize: 100 * 1024 * 1024},
});

app.get('/data', (req: any, res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(path.join(__dirname, 'price', 'beer.json'));
});

app.get('/ping',(req: any, res: any) => {
    res.send("ABC WORKING");
});

  
app.post('/images',upload.single("image"), async (req: { body: { data: string; image: any; }; },res: { json: (arg0: { id: string; msg: number; state: string; }) => any; })=>{
    console.log("RECEIVED");
    let obj=JSON.parse(req.body.data);
    console.log(obj.limit);
    console.log(obj.i);

    const binaryData = Buffer.from(req.body.image as any, 'base64');
    console.log(binaryData)
    
    fs.writeFileSync(`images/image-${obj.i as string}.jpg`, binaryData);

    const imagesFolder = 'images/';
    const imageFiles = fs.readdirSync(imagesFolder).filter((file: string) => file.endsWith('.jpg'));
    
    let num:number=imageFiles.length as number;

    const jsonObj={
        "id":"78giug87t56ertfhg",
        "msg":num,
        "state":"ongoing"
    }

    if(imageFiles.length as number==obj.limit as number) {
        service.process("script.py");
    }
    return res.json(jsonObj) 
})

app.post('/image',upload.array("images"), async (req: { files: any; headers: any; body: { image: any; index:number; limit:number }; },res: any)=>{
    const dataUrl=req.body.image;
    const index=req.body.index as number;
    const binaryData=Buffer.from(dataUrl.split(",")[1],'base64');
    console.log(binaryData);
    fs.writeFileSync(`images/image-${index}.jpg`,binaryData);
    const imagesFolder = 'images/';
    const imageFiles = fs.readdirSync(imagesFolder).filter((file: string) => file.endsWith('.jpg'));
    if(imageFiles.length as number==req.body.limit) {
        service.process("script.py");
    }
    const jsonObj={  
        "msg":index
    }
    return res.json(jsonObj)
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


app.post('/test',upload.single("image"), async (req: { body: { data: string; image: any[]; }; },res: { json: (arg0: { id: string; msg: number; state: string; }) => any; })=>{
    console.log("RECEIVED");
    let obj=JSON.parse(req.body.data);
    console.log(obj.limit);
    console.log(obj.i);

    let folder:string="images";

    let buffer = Buffer.from(req.body.image as any, 'base64')
    
    await uploadFile(obj.i as string,buffer,folder)
    .then(async (res) => { 
       console.log(res); 
    })
    .catch((err) => {
       console.log(err)
    }) 
})


app.post('/testarray',upload.array("images"), async (req:Request,res:Response)=>{
    console.log("RECEIVED");
    let obj=JSON.parse(req.body.data);
    console.log(obj.limit);
    
    let images=obj.images as any[]

    const imagesBuffers = images.map((img: any) => {
        return Buffer.from(img, 'base64');
    });

    let count:number=0
    imagesBuffers.forEach((image)=>{
        fs.writeFileSync(`images/image-${count}.jpg`, image);
        count++;
    })
    
    
    service.process("script.py");

    const jsonObj={
        "id":"78giug87t56ertfhg",
        "msg":imagesBuffers.length,
        "state":"ongoing"
    }
    
    return res.json(jsonObj) 
       
    /*
    await uploadFiles(imagesBuffers,folder)
       .then(async (imageUrls) => { 
          console.log(imageUrls); 
          const jsonObj={
            "id":imageUrls,
            "msg":imagesBuffers.length,
            "state":"finished"
          }
          return res.json(jsonObj);
       })
       .catch((err) => {
          console.log(err)
       }) 
    */

})



const server = http.createServer(app);

server.listen(process.env.PORT || 80,()=>{
    console.log(`Server is running ${process.env.IP || 'localhost'}:${app.get('PORT')}`);
});



