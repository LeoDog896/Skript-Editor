const express         = require('express');
const compression     = require('compression')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const helmet          = require('helmet')
const bodyParser      = require('body-parser')
const markdown        = require('./markdown.js')
const app             = express();
const tiny            = require('./tiny.js');
const http            = require('http').createServer(app);

let tinyURL = [];
let tinyURLfetch = [];

let shareURL = [];
let shareURLfetch = [];

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

function applyDelta(text, delta) {
  text = text + '';
  var docLines = text.split('\n')
  var row = delta.start.row;
  var startColumn = delta.start.column;
  var line = docLines[row] || "";
  switch (delta.action) {
    case "insert":
      var lines = delta.lines;
      if (lines.length === 1) {
        docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
      } else {
        var args = [row, 1].concat(delta.lines);
        docLines.splice.apply(docLines, args);
        docLines[row] = line.substring(0, startColumn) + docLines[row];
        docLines[row + delta.lines.length - 1] += line.substring(startColumn);
      }
      break;
    case "remove":
      var endColumn = delta.end.column;
      var endRow = delta.end.row;
      if (row === endRow) {
        docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
      } else {
        docLines.splice(
          row, endRow - row + 1,
          line.substring(0, startColumn) + docLines[endRow].substring(endColumn)
        );
      }
      break;
  }
  return docLines
};

app.get('/license', async (request, response) => response.send(await markdown.buildFile('LICENSE.md', {title: "skLicense", desc: "License for Skript Editor", style: "/styles/markdown.css"})))
app.get('/api', async (request, response) => response.send(await markdown.buildFile('API.md', {title: "skAPI", desc: "API for Skript Editor", style: "/styles/markdown.css"})))
app.get('/code_of_conduct', async (request, response) => response.send(await markdown.buildFile('CODE_OF_CONDUCT.md', {title: "skCOC", desc: "Code of Conduct for skript editor", style: "/styles/markdown.css"})))
app.get('/contributors', async (request, response) => response.send(await markdown.buildFile('CONTRIBUTION.md', {title: "Contribution", desc: "Users who contributed to skEditor", style: "/styles/markdown.css"})))
app.get('/contribution', async (request, response) => response.send(await markdown.buildFile('CONTRIBUTION.md', {title: "Contribution", desc: "Users who contributed to skEditor", style: "/styles/markdown.css"})))


var listener = app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + listener.address().port));

const io = require('socket.io').listen(listener);

var allCode = ""

io.on('connection', socket => {
  socket.on("login", e => {
    console.log(allCode)
    socket.username = e;
    socket.emit("verified", allCode)
    socket.broadcast.emit('userLogin', e)
    socket.on('disconnect', () => {
      console.log(allCode)
      if (Object.keys(io.sockets.connected).length == 0) {
        allCode = "";
      }
      io.emit('userDisconnect', socket.username)
    });
    socket.on('change', data => {
      console.log(allCode)
      allCode = applyDelta(allCode, data)
      socket.broadcast.emit("changeEvent", data)
    })
  })
});