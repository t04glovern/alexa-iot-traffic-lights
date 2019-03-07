//
// Utility functions
//

"use strict";

const request = require("request");

module.exports = {
  changeLightColor: function (color, callback) {

    var options = {
      method: 'POST',
      url: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/lights',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json'
      },
      body: {
        'color': color
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) {
        callback();
      }
      callback(body.status);
    });
  }
}
