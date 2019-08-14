const express         = require('express');
const compression     = require('compression')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const helmet          = require('helmet')
const bodyParser      = require('body-parser')
const markdown        = require('./markdown.js')
const app             = express();
const tiny            = require('./tiny.js');
const http            = require('http').createServer(app);
const io              = require('socket.io')(http);

let humans = [];
let retrieveHumans = [];

app.use(redirectToHTTPS());
app.use(compression());
app.use(express.static('public'));
app.use(helmet());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/app', (req, res) => res.sendFile(__dirname + '/views/app.html'));
app.get('/share', (req, res) => res.sendFile(__dirname + '/views/share.html'))
app.get('/embed', (req, res) => res.sendFile(__dirname + '/views/embed.html'))
app.get('/alone', (req, res) => res.sendFile(__dirname + '/views/alone.html'))
app.get('/raw', (req, res) => res.sendFile(__dirname + '/views/raw.html'))

app.post('/shorturl', (req, res) => {
  let tim = tiny(6);
  let isSame = false;
  while (!isSame) {
    tim = tiny(6);
    if (!humans.find(i => i == tim)) isSame = true
  }
  humans.push(tim);
  retrieveHumans[tim] = req.body.data
  app.get("/u/" + tim, (req, res) => res.redirect("/app#" + retrieveHumans[req.url.substring(3)]))
  res.json({url: "u/" + tim, data: req.body.data})
})

app.post('/shareurl', (req, res) => {
  let tim = tiny(6);
  let isSame = false;
  while (!isSame) {
    tim = tiny(6);
    if (!humans.find(i => i == tim)) isSame = true
  }
  humans.push(tim);
  retrieveHumans[tim] = req.body.data
  app.get("/share/" + tim, (req, res) => {
    // TODO make real time share
    res.redirect("/app#" + retrieveHumans[req.url.substring(7)])
  })
  res.json({url: "share/" + tim, data: req.body.data})
})

app.get('/license', async (request, response) => response.send(await markdown.buildFile('LICENSE.md', {title: "skLicense", desc: "License for Skript Editor", style: "/styles/markdown.css"})))
app.get('/api', async (request, response) => response.send(await markdown.buildFile('API.md', {title: "skAPI", desc: "API for Skript Editor", style: "/styles/markdown.css"})))
app.get('/code_of_conduct', async (request, response) => response.send(await markdown.buildFile('CODE_OF_CONDUCT.md', {title: "skCOC", desc: "Code of Conduct for skript editor", style: "/styles/markdown.css"})))
app.get('/contributors', async (request, response) => response.send(await markdown.buildFile('CONTRIBUTION.md', {title: "Contribution", desc: "Users who contributed to skEditor", style: "/styles/markdown.css"})))
app.get('/contribution', async (request, response) => response.send(await markdown.buildFile('CONTRIBUTION.md', {title: "Contribution", desc: "Users who contributed to skEditor", style: "/styles/markdown.css"})))


const listener = app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + listener.address().port));