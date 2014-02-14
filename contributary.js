var cors = require('cors');
var express = require('express');

var github = require('./github.js');

var PORT = process.env.PORT || 8080;

var app = express();

app.use(cors());

app.get('/contributors/:user/:repo', function (req, res) {
  github.contributors(req.param('user'), req.param('repo'),
      function (err, contributors) {
    res.send(contributors);
  });
});

app.listen(PORT, function () {
  console.log('Listening on %d', PORT);
});
