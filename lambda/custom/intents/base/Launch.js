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
