const express = require('express');
var compression = require('compression')
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
const app = express();
app.use(redirectToHTTPS())
app.use(compression())
app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/app', (req, res) => res.sendFile(__dirname + '/views/app.html'));
const listener = app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + listener.address().port));
