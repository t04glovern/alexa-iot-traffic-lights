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
