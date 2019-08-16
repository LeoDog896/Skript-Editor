const express         = require('express');
const compression     = require('compression')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const helmet          = require('helmet')
const bodyParser      = require('body-parser')
const markdown        = require('./markdown.js')
const app             = express();
const tiny            = require('./tiny.js');
const http            = require('http').createServer(app);
const hbs             = require('hbs');
const ace             = require('./ace')

let tinyURL = [];
let tinyURLfetch = [];

let shareURL = [];
let shareURLfetch = [];

hbs.registerPartials(__dirname + '/partials');
app.set('view engine', 'hbs');

app.use(redirectToHTTPS());
app.use(compression());
app.use(express.static('public'));
app.use(helmet());
app.use(bodyParser.urlencoded());

app.use('/blocks', express.static(__dirname + '/blocks/'));

app.get('/', (req, res) => res.render('index'));
app.get('/app', (req, res) => res.render('app'));
app.get('/share', (req, res) => res.render('share'))
app.get('/embed', (req, res) => res.render('embed'))
app.get('/alone', (req, res) => res.render('alone'))
app.get('/raw', (req, res) => res.render('raw'))

app.post('/shorturl', (req, res) => {
  let tim = tiny(6);
  let isSame = false;
  while (!isSame) {
    tim = tiny(6);
    if (!tinyURL.find(i => i == tim)) isSame = true
  }
  tinyURL.push(tim);
  tinyURLfetch[tim] = req.body.data
  app.get("/u/" + tim, (req, res) => res.redirect("/app#" + tinyURLfetch[req.url.substring(3)]))
  res.json({url: "u/" + tim, data: req.body.data})
})

app.post('/shareurl', (req, res) => {
  let tim = tiny(6);
  let isSame = false;
  while (!isSame) {
    tim = tiny(6);
    if (!shareURL.find(i => i == tim)) isSame = true
  }
  shareURL.push(tim);
  shareURLfetch[tim] = req.body.data
  res.json({url: "share#" + tim, data: req.body.data})
})

app.get('/license', async (request, response) => response.send(await markdown.buildFile('LICENSE.md', {title: "skLicense", desc: "License for Skript Editor", style: "/styles/markdown.css"})))
app.get('/api', async (request, response) => response.send(await markdown.buildFile('API.md', {title: "skAPI", desc: "API for Skript Editor", style: "/styles/markdown.css"})))
app.get('/code_of_conduct', async (request, response) => response.send(await markdown.buildFile('CODE_OF_CONDUCT.md', {title: "skCOC", desc: "Code of Conduct for skript editor", style: "/styles/markdown.css"})))
app.get('/contributors', async (request, response) => response.send(await markdown.buildFile('CONTRIBUTION.md', {title: "Contribution", desc: "Users who contributed to skEditor", style: "/styles/markdown.css"})))
app.get('/contribution', async (request, response) => response.send(await markdown.buildFile('CONTRIBUTION.md', {title: "Contribution", desc: "Users who contributed to skEditor", style: "/styles/markdown.css"})))


var listener = app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + listener.address().port));

const io = require('socket.io').listen(listener);

Document = ace.Document
var allCode = new Document("")

io.on('connection', socket => {
  socket.on("login", e => {
    socket.username = e;
    socket.emit("verified", allCode.getValue())
    socket.broadcast.emit('userLogin', e)
    socket.on('disconnect', () => {
      if (Object.keys(io.sockets.connected).length == 0) allCode.setValue("")
      io.emit('userDisconnect', socket.username)
    });
    socket.on('change', data => {
      allCode.applyDelta(data.delta)
      socket.broadcast.emit("changeEvent", data.delta)
    })
  })
});