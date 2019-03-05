# Project Structure

## Extract Intents

```bash
.
├── lambda
├──── custom
├────── intents
├──────── base
├────────── Errors.js
├────────── Help.js
├────────── Launch.js
├────────── SessionEnd.js
├────────── Stop.js
├──────── LightChange.js
├────── index.js
```

This will leave your index.js with the following

```javascript
/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

// Base Intent Handlers
const Errors = require('./intents/base/Errors');
const Help = require('./intents/base/Help');
const Launch = require('./intents/base/Launch');
const SessionEnd = require('./intents/base/SessionEnd');
const Stop = require('./intents/base/Stop');

// Custom Intents
const LightChange = require('./intents/LightChange');

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    Help,         // Base intents
    Launch,
    SessionEnd,
    Stop,
    LightChange   // Custom Intents
  )
  .addErrorHandlers(Errors)
  .lambda();
```

Wow so clean.

## Skill Manifest

Update the skill.json

```json
{
  "manifest": {
    "publishingInformation": {
      "locales": {
        "en-US": {
          "summary": "Alexa IoT Traffic light changer",
          "examplePhrases": [
            "Alexa open traffic light changer",
            "traffic light changer"
          ],
          "name": "alexa-iot-traffic-lights",
          "description": "Leverages AWS IoT to control a traffic light unit"
        }
      },
      "isAvailableWorldwide": true,
      "testingInstructions": "Sample Testing Instructions.",
      "category": "EDUCATION_AND_REFERENCE",
      "distributionCountries": []
    },
    "apis": {
      "custom": {
        "endpoint": {
          "sourceDir": "lambda/custom",
          "uri": "ask-custom-alexa-iot-traffic-lights-default"
        }
      }
    },
    "manifestVersion": "1.0"
  }
}
```

## Model Update

Update the model to include the new LightChange intent

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
          "samples": [
            "change the lights"
          ]
        }
      ]
    }
  }
}
```

## Test Deployment [Debug if needed]

Run the following to deploy the skill and confirm you didn't mess up

```bash
ask deploy
```

### Test Harness

Create a file called `sim.sh` and include the following

```bash
#!/bin/bash

ask simulate -t "open traffic light changer"  -l "en-US"  --force-new-session
ask simulate -t "change the lights"           -l "en-US"
```

Running `./sim.sh` should result in two intents triggering and the following output

```json

...

"invocationResponse": {
  "body": {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "SSML",
        "ssml": "<speak>Light Change!</speak>"
      },
      "card": {
        "type": "Simple",
        "title": "Light Change",
        "content": "Light Change!"
      },
      "type": "_DEFAULT_RESPONSE"
    },
    "sessionAttributes": {},
    "userAgent": "ask-node/2.4.0 Node/v8.10.0"
  }
}

...

```
