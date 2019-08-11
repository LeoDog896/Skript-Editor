const express         = require('express');
const compression     = require('compression')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const helmet          = require('helmet')
const app = express();

app.use(redirectToHTTPS());
app.use(compression());
app.use(express.static('public'));
app.use(helmet());

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/app', (req, res) => res.sendFile(__dirname + '/views/app.html'));
app.get('/embed', (req, res) => res.sendFile(__dirname + '/views/embed.html'))

const listener = app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + listener.address().port));
