const express = require('express');
var compression = require('compression')
const app = express();
app.use(express.static('public'));
app.use(compression())
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/app', (req, res) => res.sendFile(__dirname + '/views/app.html'));
const listener = app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + listener.address().port));
