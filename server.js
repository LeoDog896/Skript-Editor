const express         = require('express');
const compression     = require('compression')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const helmet          = require('helmet')
const bodyParser      = require('body-parser')
const markdown        = require('./markdown.js')
const app             = express();
const tiny            = require('./tiny.js')

let humans = [];
let retrieveHumans = [];

app.use(redirectToHTTPS());
app.use(compression());
app.use(express.static('public'));
app.use(helmet());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/app', (req, res) => res.sendFile(__dirname + '/views/app.html'));
app.get('/embed', (req, res) => res.sendFile(__dirname + '/views/embed.html'))
app.get('/alone', (req, res) => res.sendFile(__dirname + '/views/alone.html'))
app.get('/raw', (req, res) => res.sendFile(__dirname + '/views/raw.html'))

app.route('/shorturl').post((req, res) => {
  let tim = tiny(5);
  let isSame = false;
  while (!isSame) {
    tim = tiny(5);
    if (!humans.find(i => i == tim)) isSame = true
  }
  humans.push(tim);
  retrieveHumans[tim] = req.body.data
  app.get("/" + tim, (req, res) => res.redirect("/app#" + retrieveHumans[req.url.substring(1)]))
  res.json({url: tim, data: req.body.data})
}).get((req, res) => res.json({error: "Wrong Method"}))

app.get('/license', async (request, response) => response.send(await markdown.buildFile('LICENSE.md', {title: "skLicense", desc: "License for Skript Editor", style: "/styles/markdown.css"})))
app.get('/api', async (request, response) => response.send(await markdown.buildFile('API.md', {title: "skAPI", desc: "API for Skript Editor", style: "/styles/markdown.css"})))

const listener = app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + listener.address().port));