const express = require('express')
const app=express()
const path = require('path')
const port = process.env.PORT||3000;
const bodyParser = require('body-parser');
const moment = require('moment')
app.locals.moment = moment;
const axios = require("axios");
const acae = require("@dcae_client/dcae_decoder");
// template engine  
app.use(express.static('public'))
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set the view engine to ejs
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views/pages'))
app.use(express.static(path.join(__dirname, 'public')))
// use res.render to load up an ejs view file
//cors
const cors = require('cors');
app.use(cors());

function toBuffer(ab) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

app.get('/',async function(req, res) {
    res.redirect('/index/1')  
});

app.get('/index/:pages',async function(req, res) {
    var pages = req.params.pages || 1
    const buffer    = await axios.get('http://127.0.0.1:8000/', {responseType: 'arraybuffer'})
    const ch        = await toBuffer(buffer.data)
    const base64    = await acae.decode(ch)
    res.render('pages/index' ,{ img_url: base64, pages : parseInt(pages) })  
});

app.listen(port,()=> console.log("started"))