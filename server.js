const express         = require('express');
const compression     = require('compression')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const helmet          = require('helmet')
const bodyParser      = require('body-parser')
const app             = express();
const tiny            = require('./tiny.js');
const http            = require('http').createServer(app);
const hbs             = require('hbs');
const ace             = require('./ace')
const lzString        = require('lz-string')

let tinyURL = [];
let tinyURLfetch = [];

let shareURL = [];
let shareURLfetch = [];

hbs.registerPartials(__dirname + '/modules/partials');
app.set('view engine', 'hbs');

app.use(redirectToHTTPS());
app.use(compression());
app.use(express.static('public'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.use('/blocks', express.static(__dirname + '/modules/blocks/'));

app.get('/', (req, res) => res.render('index'));
app.get('/app', (req, res) => res.render('app'));
app.get('/share', (req, res) => res.render('share'));
app.get('/embed', (req, res) => res.render('embed'));
app.get('/alone', (req, res) => res.render('alone'));
app.get('/raw', (req, res) => res.render('raw'));

app.post('/shorturl', (req, res) => {
  let tim = tiny(6);
  while (tinyURL[tim]) {
    console.log(tim)
    tim = tiny(6);
  }
  tinyURL.push(tim);
  tinyURLfetch[tim] = req.body.data;
  app.get(`u/${tim}`, (req, res) => res.redirect(`/app#${tinyURLfetch[req.url.substring(3)]}`));
  res.json({
    url: `u/${tim}`,
    data: req.body.data,
  });
});

app.post('/shareurl', (req, res) => {
  let tim = tiny(6);
  while (shareURL[tim]) {
    tim = tiny(6);
  }
  if (!allCode[tim]) allCode[tim] = new Document(lzString.decompressFromBase64(req.body.data));
  shareURL.push(tim);
  shareURLfetch[tim] = req.body.data
  res.json({
    url: `share#${tim}`,
    data: req.body.data,
  });
});

var listener = app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + listener.address().port));

const io = require('socket.io').listen(listener);

Document = ace.Document
var allCode = [];

io.on('connection', socket => {
  socket.on('login', ({ username, channel }) => {
    socket.username = username;
    socket.join(channel);
    socket.theChannel = channel;
    if (!allCode[socket.theChannel]) allCode[socket.theChannel] = new Document('');
    socket.to(channel).emit('JoinRoom', {username, channel});
    socket.emit('verified', allCode[socket.theChannel].getValue());
    socket.on('disconnect', () => {
      if (Object.keys(io.sockets.connected).length == 0) delete allCode[socket.theChannel];
      io.to(socket.theChannel).emit('userDisconnect', socket.username);
    });
    socket.on('change', ({ delta, cursor, highlight }) => {
      allCode[socket.theChannel].applyDelta(delta);
      socket.to(socket.theChannel).emit('changeEvent', delta);
    });
  });
});
