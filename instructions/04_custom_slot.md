# Custom Slots

## Model Updates

We need to update the model to make use of an [Amazon custom slot](https://developer.amazon.com/docs/custom-skills/slot-type-reference.html) called AMAZON.Color

```json
{
  "interactionModel": {
    "languageModel": {
      "invocationName": "traffic light changer",
      "intents": [
        {
          "name": "AMAZON.CancelIntent",
          "samples": []
        },
        {
          "name": "AMAZON.HelpIntent",
          "samples": []
        },
        {
          "name": "AMAZON.StopIntent",
          "samples": []
        },
        {
          "name": "LightChangeIntent",
          "slots": [
            {
              "name": "LightColor",
              "type": "AMAZON.Color"
            }
          ],
          "samples": [
            "change the light color to {LightColor}",
            "set lights to {LightColor}",
            "{LightColor}"
          ]
        }
      ]
    }
  }
}
```

## Slot Data Access

Retrieve the data from the slot by making the following changes to `LightChange.js`

```javascript
"use strict";

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'LightChangeIntent';
  },
  handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const res = require("../resources")(event.request.locale);
    const color = getLightColor(event);

    let speechText;
    let reprompt;

    speechText = res.strings.COLOR_NOT_FOUND.replace("{0}", color);
    reprompt = res.strings.COLOR_CHANGE.replace("{0}", color);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(reprompt)
      .getResponse();
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

Your response will say it can't find blue, however that actually means its worked since the word blue was extracted from our intent

```json

...

"invocationResponse": {
  "body": {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak>No light color blue was found.</speak>"
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
