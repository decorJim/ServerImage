import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';

const app=express();

app.set('PORT', 8080);

app.use((req, res, next) => {   // must be here to make http request work without access problems
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use(bodyParser.json());

app.post('/image',(req,res)=>{
    console.log("RECEIVED");
    console.info(req.body);
    const jsonObj={
        "id":"78giug87t56ertfhg",
        "msg":"response from server"
    }
    res.json(jsonObj);
})

const server = http.createServer(app);

server.listen(8080,()=>{
    console.info("app running on port 8080")
})