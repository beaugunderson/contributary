var async = require('async');
var format = require('format');
var request = require('request');

var GITHUB_API = 'https://api.github.com';

// Make a request to the GitHub API
function github(relativeUrl, cb) {
  request.get({
    url: GITHUB_API + relativeUrl,
    json: true,
    headers: {
      'User-Agent': 'contributary',
      'Authorization': format('token %s', process.env.GITHUB_API_TOKEN)
    }
  }, function (err, res, body) {
    cb(err, body);
  });
}

// Get the metadata for a GitHub user
exports.user = function (user, cb) {
  github('/users/' + user, function (err, user) {
    cb(err, user);
  });
};

exports.user = async.memoize(exports.user);

// Get the contributor data for a GitHub repo
exports.contributors = function (user, repo, cb) {
  github(format('/repos/%s/%s/contributors', user, repo),
      function (err, contributors) {
    async.each(contributors, function (contributor, cbEach) {
      exports.user(contributor.login, function (err, user) {
        contributor.name = user.name;
        contributor.user_data = user;

        cbEach(err);
      });
    }, function (err) {
      cb(err, contributors);
    });
  });
};

exports.contributors = async.memoize(exports.contributors);
