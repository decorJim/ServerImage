import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import multer from "multer";
import fs from 'fs';

const app=express();

app.set('PORT', 8080);

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

app.post('/image',upload.array("images"),async (req,res)=>{
    console.log("RECEIVED");
    let imagemap=Object.entries(req.body); 
    imagemap.forEach((pair)=>{
        console.log(pair[0]);
        let timestamp = Date.now();
        const binaryData = Buffer.from(pair[1] as any, 'base64');
        console.log(binaryData)
        fs.writeFileSync(`images/image-${timestamp}.jpg`, binaryData);
    }) 

    const jsonObj={
        "id":"78giug87t56ertfhg",
        "msg":"response from server"
    }
    res.json(jsonObj);
})

const server = http.createServer(app);

server.listen(8080,()=>{
    console.info("app running on port 8080")
});