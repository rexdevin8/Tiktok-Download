const express = require('express');
const tiktok = require("tiktok-down");
const request = require('request');
const path = require('path');
const exp = require('constants');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.port || 3000;

var urlencodedParser = bodyParser.urlencoded({extended: false});

// middleware

app.use(express.json());
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, '..', 'Frontend')));
app.set('view engine', 'html');

var glob_filename = "";
home_page = path.join(__dirname, '..', 'Frontend', 'index.html');
download_page = path.join(__dirname, '..', 'Frontend', 'download.html');


// Routes 

app.get('/',(req,res) => {
    res.sendFile(home_page);
});

app.get('/convert', function(req,res){
    res.sendFile(home_page, {qs: req.query});
});
app.post('/convert', urlencodedParser, function(req,res){
    console.log(req.body["url-fld"]);
    res.sendFile(download_page, {qs: req.query});
});


app.get('/about',(req,res) => {
    res.json({ About:'Tiktok Unofficial API',Owner:'DiyRex :)', Release_Date:'10/30/22', Version:'1.0', API_Usage:{ProcessVideo:'localhost:port/processdl?url={tiktok_video_url}',Download_Video:'localhost:port/download?tikurl={url_from_response}'} });
});

app.get('/processdl', async (req,res) => {
    console.log(req.query.url); // localhost:3000/download?url={url}
    const option = {
        url: req.query.url,
        noWaterMark: true, // set true, If You Want No WaterMark
        checkUpdate: false, // set true, If You Want Update Notification
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
      };
    tkurl = await tiktok(option);
    vid_url = tkurl["video"]["url"];
    vid_owner = tkurl["owner"]["uniqueID"];
    vid_id = tkurl["owner"]["id"];
    filename = `${vid_owner}@${vid_id}`
    glob_filename = filename;
    console.log(vid_url);
    res.send(`http://localhost:3000/p?vid=${vid_url}`);
    //res.send(tkurl);
    console.log(filename);
});

app.get('/download',function(req,res){
    res.setHeader("content-disposition", `attachment; filename=${glob_filename}.mp4`);
    request(req.query.tikurl).pipe(res);
})

app.listen(port, () => console.log(`App listening on URL http://localhost:${port}`))