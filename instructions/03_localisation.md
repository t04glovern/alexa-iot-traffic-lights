# Localisation

## Localisation Handler

Create a file called `resources.js` next to `index.js`

```javascript
const resources = {
  "en-US": {
    translation: {
      // intents/LightChange.js
      'COLOR_NOT_FOUND': 'No light color {0} was found.',
      'COLOR_CHANGED': 'Color changed to {0}.',
      'COLOR_CHANGE': 'Want to change the color of the lights? Say: set lights to {0}',
      // intents/base/Help.js
      'HELP_FALLBACK': 'I wasn\'t able to understand your previous command.',
      'HELP_REPROMPT': 'Want to change the lights? say Change Lights',
      // intents/base/Launch.js
      'LAUNCH_WELCOME': 'Welcome to Traffic light changer. ',
      'LAUNCH_REPROMPT': 'Want to change the lights? say Change Lights',
      // intents/base/Stop.js
      'EXIT_SKILL': 'Goodbye!',
    }
  }
};

const utils = locale => {
  let translation;
  if (resources[locale]) {
    translation = resources[locale].translation;
  } else {
    // Default to en-US
    translation = resources["en-US"].translation;
  }

  return {
    strings: translation
  };
};

module.exports = utils;
```

## Help Fallback Intent

Change the Help.js intent to include the FallbackIntent for cases where the skill fails

```javascript
"use strict";

module.exports = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.HelpIntent" ||
        request.intent.name === "AMAZON.FallbackIntent")
    );
  },
  handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const res = require("../../resources")(event.request.locale);
    const speech = "";

    // If this was fallback intent, we didn't understand
    if (event.request.intent.name === "AMAZON.FallbackIntent") {
      speech += res.getString("HELP_FALLBACK");
    }

    const reprompt = res.getString("HELP_REPROMPT");
    speech += reprompt;
    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(reprompt)
      .getResponse();
  }
};
```

## Launch Intent

```javascript
"use strict";

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const res = require("../../resources")(event.request.locale);

    let speech = res.strings.LAUNCH_WELCOME;
    const reprompt = res.strings.LAUNCH_REPROMPT;
    speech += reprompt;

    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(reprompt)
      .getResponse();
  }
}
```

## Stop Intent

```javascript
"use strict";

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const event = handlerInput.requestEnvelope;
    const res = require("../../resources")(event.request.locale);
    const speechText = res.strings.EXIT_SKILL;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
}
```

## Light Change

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

    let speechText;
    let reprompt;

    speechText = res.strings.COLOR_CHANGED.replace("{0}", "Red");
    reprompt = res.strings.COLOR_CHANGE.replace("{0}", "Red");

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(reprompt)
      .getResponse();
  }
}
```

## Test Again

```bash
ask deploy
./sim.sh
```

You should see a response that is substituting in your locale translations

```json

...

"invocationResponse": {
  "body": {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak>No light color Red was found.</speak>"
      },
      "reprompt": {
        "outputSpeech": {
          "type": "SSML",
          "ssml": "<speak>Want to change the color of the lights? Say: Change lights to Red</speak>"
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
