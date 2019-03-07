'use strict';

const AWS = require('aws-sdk');

const iotEndpoint = process.env.IOT_ENDPOINT;
const iotTopic = process.env.IOT_TOPIC;

const iotdata = new AWS.IotData({
  endpoint: iotEndpoint
});

const colorMap = {
  "red": "R",
  "blue": "B",
  "green": "G"
};

module.exports.lights = (event, context, callback) => {
  var body = JSON.parse(event.body)
  var color = body['color'];
  var params = {
    topic: iotTopic,
    payload: colorMap[color],
    qos: 0
  };

  return iotdata.publish(params, function (err, data) {
    var response;
    if (err) {
      console.log(err);
      response = {
        "statusCode": 200,
        "body": JSON.stringify({
          "message": 'IoT Publish failed: ' + err,
          "status": 'failure'
        }),
        "isBase64Encoded": false
      };
    } else {
      response =  {
        "statusCode": 200,
        "body": JSON.stringify({
          "message": 'Publish Successful of color: ' + color,
          "status": 'success'
        }),
        "isBase64Encoded": false
      };
    }
    callback(null, response);
  });
};
