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
