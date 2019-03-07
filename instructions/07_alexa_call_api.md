# Alexa Call API

In this section we'll call Alexa over the newly created API endpoint

## Utils

Create a new file called `utils.js` in the same directory as `index.js`

Ensure that the endpoint within this file matches the one you got from your API gateway setup in the previous step

```javascript
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
```

You will also need to install the request library by changing into `lambda/custom` and running the following

```bash
npm install request
```

## Light Change Update

Update the LightChange.js file with the new calls to the `utils.changeLightColor` function

```javascript
"use strict";

const utils = require("../utils");

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'LightChangeIntent';
  },
  handle(handlerInput) {
    return new Promise((resolve, reject) => {
      const event = handlerInput.requestEnvelope;
      const res = require("../resources")(event.request.locale);
      const color = getLightColor(event);

      let speechText;
      let reprompt;

      reprompt = res.strings.COLOR_CHANGE.replace("{0}", color);

      utils.changeLightColor(color, response => {
        if (!response) {
          speechText = res.strings.COLOR_NOT_FOUND.replace("{0}", color);
        } else {
          speechText = res.strings.COLOR_CHANGED.replace("{0}", color);
        }

        const responseHandle = handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(reprompt)
          .getResponse();
        resolve(responseHandle);
      })
    });
  }
}

function getLightColor(event) {
  let lightColor;
  const lightColorSlot =
    event.request.intent &&
    event.request.intent.slots &&
    event.request.intent.slots.LightColor;

  if (lightColorSlot && lightColorSlot.value) {
    lightColor = lightColorSlot.value;
  }
  return lightColor;
}
```

## Testing

Change the `sim.sh` file to reflect the slot changes

```bash
#!/bin/bash

ask simulate -t "open traffic light changer"  -l "en-US"  --force-new-session
ask simulate -t "set lights to blue"          -l "en-US"
```

Running the simulation should now change the LED to the color you utter (as long as it's Red, Green, Blue).

```json

...

"invocationResponse": {
  "body": {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak>Color changed to blue.</speak>"
      },
      "reprompt": {
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Want to change the color of the lights? Say: set lights to blue</speak>"
        }
      },
      "shouldEndSession": false,
      "type": "_DEFAULT_RESPONSE"
    },
    "sessionAttributes": {},
    "userAgent": "ask-node/2.4.0 Node/v8.10.0"
  }
}

...

```
