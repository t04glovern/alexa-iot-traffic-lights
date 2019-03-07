# AWS IoT API

The following outlines the setup of the serverless function used to control our IoT device

## Serverless Setup

Creating our serverless project requires the Serverless framework cli toolchain. This can be installed either by following the guide HERE or with the following commands

```bash
npm install -g serverless
serverless config credentials --provider aws --key $ACCESS_KEY_ID --secret $SECRET_KEY
```

Create a new project; making use of the `aws-nodejs` template

```bash
mkdir aws-iot-api
cd aws-iot-api
serverless create --template aws-nodejs --name aws-iot-api
```

## Serverless Config

Ensure that your topic setup here is the same one you setup as your subscription within your IoT code.

```yaml
service: aws-iot-api

provider:
  name: aws
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "iot:Publish"
      Resource:
        Fn::Join:
          - ":"
          - - "arn:aws:iot"
            - Ref: "AWS::Region"
            - Ref: "AWS::AccountId"
            - "topic/devopstar/alexa/esp8266-group"
  runtime: nodejs8.10
  environment:
    IOT_ENDPOINT: xxxxxxxxxxxxx.iot.us-east-1.amazonaws.com
    IOT_TOPIC: devopstar/alexa/esp8266-group

functions:
  lights:
    handler: handler.lights
    events:
      - http:
          path: lights
          method: post
```

## Handler

```javascript
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
```

## Deploy & Test

```bash
serverless deploy
```

You should also get back some data about your deployment. Take note of your endpoint for use in the alexa skill

```bash
Service Information
service: aws-iot-api
stage: dev
region: us-east-1
stack: aws-iot-api-dev
resources: 10
api keys:
  None
endpoints:
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/lights
functions:
  lights: aws-iot-api-dev-lights
layers:
  None
Serverless: Removing old service artifacts from S3...
```

Testing the endpoint can be done with the serverless command below

```bash
serverless invoke -f lights --data '{ "color":"blue" }'
```
