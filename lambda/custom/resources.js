//
// Localized resources
//

const resources = {
  "en-US": {
    translation: {
      // intents/LightChange.js
      'COLOR_NOT_FOUND': 'No light color {0} was found.',
      'COLOR_CHANGE': 'Want to change the color of the lights? Say: Change lights to {0}',
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
