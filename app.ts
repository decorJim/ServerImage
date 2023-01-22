import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import multer from "multer";
import fs from 'fs';
import service from './imageService';


const app=express();

app.set('PORT',process.env.PORT || 8080);

app.use((req, res, next) => {   // must be here to make http request work without access problems
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

app.post('/images',upload.single("image"), (req,res)=>{
    console.log("RECEIVED");
    let obj=JSON.parse(req.body.data);
    console.log(obj.limit);
    let timestamp = Date.now();
    const binaryData = Buffer.from(req.body.image as any, 'base64');
    console.log(binaryData)
    fs.writeFileSync(`images/image-${timestamp}.jpg`, binaryData);

    const imagesFolder = 'images/';
    const imageFiles = fs.readdirSync(imagesFolder).filter(file => file.endsWith('.jpg'));
    
    if(imageFiles.length==obj.limit as number) {
        service.process("script.py").then(()=>{
            console.log("finished");
        });
    }

    const jsonObj={
        "id":"78giug87t56ertfhg",
        "msg":"response from server"
    }
    res.json(jsonObj);
})

app.post('/image',upload.single("image"), async (req,res)=>{
    console.log(req.headers)
    console.log(req.body.data)

    let timestamp = Date.now();
    const binaryData = Buffer.from(req.body.image as any, 'base64');
    console.log(binaryData)
    fs.writeFileSync(`images/image-${timestamp}.jpg`, binaryData);
})

app.get('/results',(req,res)=>{
    const imagesFolder = 'results/';
    const imageFiles = fs.readdirSync(imagesFolder).filter(file => file.endsWith('.jpg'));
    const images = [];
    for (let i = 0; i < imageFiles.length; i++) {
        const file = fs.readFileSync(`${imagesFolder}/${imageFiles[i]}`);
        const base64 = Buffer.from(file).toString('base64');
        images.push(base64);
    }
    res.send(images);
})

const server = http.createServer(app);

server.listen(process.env.PORT || 8080,()=>{
    console.log(`Server is running localhost:${app.get('PORT')}`);
});


