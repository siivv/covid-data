//
// covid data skill
//

// sets up dependencies
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const languageStrings = require('./languageStrings');
const standardizeCountry = require('./standardizeCountry');
const standardizeState = require('./standardizeState');

// aws service apis
const awsDynamoDB = require("aws-sdk/clients/dynamodb");
const dynamodbDoc = new awsDynamoDB.DocumentClient();

const CONFIG = {
  TABLE_COUNTRY: "covid_country",
  TABLE_STATE: "covid_state"
};


/* *
 * covid cases intent handler
 * */
const CovidCasesIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'cases';
  },
  handle(handlerInput) {
    // get region requested
    const slotCountry = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_country');
    const slotState = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_state');
    const slotDate = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_date');

    let regionDate = new Date().toISOString().slice(0, -14); // today
    let regionDateSpeak = "today";
    // date check
    if (slotDate && slotDate !== null && slotDate !== "") {
      regionDate = slotDate;
      regionDateSpeak = slotDate;
    }

    // default
    let subIntent = "the world";

    let getParams = {
      TableName: CONFIG.TABLE_COUNTRY,
      ProjectExpression: "active, cases, todayCases",
      FilterExpression: "record_dtm = :record_dtm",
      ExpressionAttributeValues: {
        ":record_dtm": regionDate
      }
    };

    // country check
    if (slotCountry && slotCountry !== null && slotCountry !== "") {
      // cleanup
      let slotCountryRev = slotCountry.toLowerCase().replace("the ", ""); // will need to make language specific
      // country mapping
      slotCountryRev = standardizeCountry.standardizeCountryName(slotCountryRev);

      subIntent = slotCountryRev;

      getParams = {
        TableName: CONFIG.TABLE_COUNTRY,
        ProjectExpression: "active, cases, todayCases",
        FilterExpression: "record_dtm = :record_dtm and country = :country",
        ExpressionAttributeValues: {
          ":record_dtm": regionDate,
          ":country": slotCountryRev
        }
      };
    }
    // state check
    else if (slotState && slotState !== null && slotState !== "") {
      // cleanup
      let slotStateRev = slotState.toLowerCase().replace("the ", ""); // will need to make language specific
      // state mapping
      slotStateRev = standardizeState.standardizeStateName(slotStateRev);
      subIntent = slotStateRev;

      getParams = {
        TableName: CONFIG.TABLE_STATE,
        ProjectExpression: "active, cases, todayCases",
        FilterExpression: "record_dtm = :record_dtm and #state = :state",
        ExpressionAttributeNames: {"#state" : "state"},
        ExpressionAttributeValues: {
          ":record_dtm": regionDate,
          ":state": slotStateRev
        }
      };
    }

    // retrieve data
    console.log(getParams);
    return dynamodbDoc.scan(getParams).promise().then(function(data) {
      let casesAll = 0;
      let casesActive = 0;
      let casesNew = 0;

      if (data.Items.length > 0) {
        data.Items.forEach(function(item) {
          if (item.cases) {
            casesAll += item.cases;
          }
          if (item.active) {
            casesActive += item.active;
          }
          if (item.cases) {
            casesNew += item.todayCases;
          }
        });
        
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t("CASES_MSG", {casesAll: casesAll, casesActive: casesActive, casesNew: casesNew, regionDate: regionDateSpeak, subIntent: subIntent});
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withSimpleCard(requestAttributes.t("CASES_TITLE"),
            speakOutput)
          .getResponse();
      }
      else {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t("CASES_NOTFOUND_MSG", {regionDate: regionDateSpeak, subIntent: subIntent});
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withSimpleCard(requestAttributes.t("CASES_TITLE"),
            speakOutput)
          .getResponse();        
      }
    }).catch(function(err) {
      return "ERROR: something went wrong calling dynamodb with error: " + JSON.stringify(err.message, null, 2);
    });
  }
};

/* *
 * covid mortality intent handler
 * */
const CovidMortalityIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'mortality';
  },
  handle(handlerInput) {
    // get region requested
    const slotCountry = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_country');
    const slotState = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_state');
    const slotDate = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_date');

    let regionDate = new Date().toISOString().slice(0, -14); // today
    let regionDateSpeak = "today";
    // date check
    if (slotDate && slotDate !== null && slotDate !== "") {
      regionDate = slotDate;
      regionDateSpeak = slotDate;
    }

    // default
    let subIntent = "the world";

    let getParams = {
      TableName: CONFIG.TABLE_COUNTRY,
      ProjectExpression: "deaths, cases, todayDeaths, todayCases",
      FilterExpression: "record_dtm = :record_dtm",
      ExpressionAttributeValues: {
        ":record_dtm": regionDate
      }
    };

    // country check
    if (slotCountry && slotCountry !== null && slotCountry !== "") {
      // cleanup
      let slotCountryRev = slotCountry.toLowerCase().replace("the ", ""); // will need to make language specific
      // country mapping
      slotCountryRev = standardizeCountry.standardizeCountryName(slotCountryRev);

      subIntent = slotCountryRev;

      getParams = {
        TableName: CONFIG.TABLE_COUNTRY,
        ProjectExpression: "deaths, cases, todayDeaths, todayCases",
        FilterExpression: "record_dtm = :record_dtm and country = :country",
        ExpressionAttributeValues: {
          ":record_dtm": regionDate,
          ":country": slotCountryRev
        }
      };
    }
    // state check
    else if (slotState && slotState !== null && slotState !== "") {
      // cleanup
      let slotStateRev = slotState.toLowerCase().replace("the ", ""); // will need to make language specific
      // state mapping
      slotStateRev = standardizeState.standardizeStateName(slotStateRev);
      subIntent = slotStateRev;

      getParams = {
        TableName: CONFIG.TABLE_STATE,
        ProjectExpression: "deaths, cases, todayDeaths, todayCases",
        FilterExpression: "record_dtm = :record_dtm and #state = :state",
        ExpressionAttributeNames: {"#state" : "state"},
        ExpressionAttributeValues: {
          ":record_dtm": regionDate,
          ":state": slotStateRev
        }
      };
    }

    // retrieve data
    console.log(getParams);
    return dynamodbDoc.scan(getParams).promise().then(function(data) {
      let deathsAll = 0;
      let casesAll = 0;
      let deathsToday = 0;
      let casesToday = 0;

      if (data.Items.length > 0) {
        data.Items.forEach(function(item) {
          if (item.deaths) {
            deathsAll += item.deaths;
          }
          if (item.cases) {
            casesAll += item.cases;
          }
          if (item.todayDeaths) {
            deathsToday += item.todayDeaths;
          }
          if (item.todayCases) {
            casesToday += item.todayCases;
          }
        });
        
        const mortalityAll = ((deathsAll / casesAll) * 100).toFixed(2);

        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t("MORTALITY_MSG", {mortalityAll: mortalityAll, deathsToday: deathsToday, casesToday: casesToday, regionDate: regionDateSpeak, subIntent: subIntent});
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withSimpleCard(requestAttributes.t("MORTALITY_TITLE"),
            speakOutput)
          .getResponse();
      }
      else {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t("MORTALITY_NOTFOUND_MSG", {regionDate: regionDateSpeak, subIntent: subIntent});
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withSimpleCard(requestAttributes.t("MORTALITY_TITLE"),
            speakOutput)
          .getResponse();        
      }
    }).catch(function(err) {
      return "ERROR: something went wrong calling dynamodb with error: " + JSON.stringify(err.message, null, 2);
    });
  }
};


/* *
 * covid growth intent handler
 * */
const CovidGrowthIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'growth';
  },
  handle(handlerInput) {
    // get region requested
    const slotCountry = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_country');
    const slotState = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_state');

    let regionDate = new Date().toISOString().slice(0, -14); // today
    let regionDate7 = new Date((new Date()).setDate((new Date()).getDate() - 8)).toISOString().slice(0, -14); // 8 days ago

    // default
    let subIntent = "the world";

    let getParams = {
      TableName: CONFIG.TABLE_COUNTRY,
      ProjectExpression: "record_dtm, todayCases",
      FilterExpression: "record_dtm >= :record_dtm",
      ExpressionAttributeValues: {
        ":record_dtm": regionDate7
      },
      ScanIndexForward: false
    };

    // country check
    if (slotCountry && slotCountry !== null && slotCountry !== "") {
      // cleanup
      let slotCountryRev = slotCountry.toLowerCase().replace("the ", ""); // will need to make language specific
      // country mapping
      slotCountryRev = standardizeCountry.standardizeCountryName(slotCountryRev);

      subIntent = slotCountryRev;

      getParams = {
        TableName: CONFIG.TABLE_COUNTRY,
        ProjectExpression: "record_dtm, todayCases",
        KeyConditionExpression: "record_dtm >= :record_dtm and country = :country",
        ExpressionAttributeValues: {
          ":record_dtm": regionDate7,
          ":country": slotCountryRev
        },
        ScanIndexForward: false
      };
    }
    // state check
    else if (slotState && slotState !== null && slotState !== "") {
      let slotStateRev = slotState.toLowerCase();
      subIntent = slotStateRev;

      getParams = {
        TableName: CONFIG.TABLE_STATE,
        ProjectExpression: "record_dtm, todayCases",
        KeyConditionExpression: "record_dtm >= :record_dtm and #state = :state",
        ExpressionAttributeNames: {"#state" : "state"},
        ExpressionAttributeValues: {
          ":record_dtm": regionDate7,
          ":state": slotStateRev
        },
        ScanIndexForward: false
      };
    }

    if (subIntent === "the world") {
      // retrieve data
      return dynamodbDoc.scan(getParams).promise().then(function(data) {
        let casesToday = {};
  
        if (data.Items.length > 0) {
          data.Items.forEach(function(item) {
            if (item.todayCases) {
              if (!(casesToday[item.record_dtm])) {
                casesToday[item.record_dtm] = 0;
              }
              casesToday[item.record_dtm] += item.todayCases;
            }
          });

          let date1Day = new Date((new Date()).setDate((new Date()).getDate() - 1)).toISOString().slice(0, -14); // 1 day ago
          let date2Day = new Date((new Date()).setDate((new Date()).getDate() - 2)).toISOString().slice(0, -14); // 2 day ago
          let date4Day = new Date((new Date()).setDate((new Date()).getDate() - 4)).toISOString().slice(0, -14); // 4 day ago
          let date7Day = new Date((new Date()).setDate((new Date()).getDate() - 7)).toISOString().slice(0, -14); // 7 day ago
          let growth1Day = "an unknown %";
          let growth3Day = "an unknown %";
          let growth7Day = "an unknown %";
        
          if (casesToday[date2Day] && casesToday[date1Day]) { 
            growth1Day = (((casesToday[date1Day] - casesToday[date2Day]) / casesToday[date2Day]) * 100).toFixed(2);
            growth1Day = growth1Day + "%";
          }
          if (casesToday[date4Day] && casesToday[date1Day]) {
            growth3Day = (((casesToday[date1Day] - casesToday[date4Day]) / casesToday[date4Day]) * 100).toFixed(2);
            growth3Day = growth3Day + "%";
          }
          if (casesToday[date7Day] && casesToday[date1Day]) {
            growth7Day = (((casesToday[date1Day] - casesToday[date7Day]) / casesToday[date7Day]) * 100).toFixed(2);
            growth7Day = growth7Day + "%";
          }
  
          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          const speakOutput = requestAttributes.t("GROWTH_MSG", {growth1Day: growth1Day, growth3Day: growth3Day, growth7Day: growth7Day, subIntent: subIntent});
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(requestAttributes.t("GROWTH_TITLE"),
              speakOutput)
            .getResponse();
        }
        else {
          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          const speakOutput = requestAttributes.t("GROWTH_NOTFOUND_MSG", {subIntent: subIntent});
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(requestAttributes.t("GROWTH_TITLE"),
              speakOutput)
            .getResponse();        
        }
      }).catch(function(err) {
        return "ERROR: something went wrong calling dynamodb with error: " + JSON.stringify(err.message, null, 2);
      });
    }
    else {
      // retrieve data
      return dynamodbDoc.query(getParams).promise().then(function(data) {
        let casesToday = [];
  
        if (data.Items.length > 0) {
          let i = 0;
          data.Items.forEach(function(item) {
            if (item.todayCases) {
              casesToday[i] = item.todayCases;
              i++;
            }
          });
  
          // 1d
          let growth1Day = "an unknown %";
          let growth3Day = "an unknown %";
          let growth7Day = "an unknown %";
          if (casesToday[2] && casesToday[1]) { 
            growth1Day = (((casesToday[1] - casesToday[2]) / casesToday[2]) * 100).toFixed(2);
            growth1Day = growth1Day + "%";
          }
          if (casesToday[4] && casesToday[1]) {
            growth3Day = (((casesToday[1] - casesToday[4]) / casesToday[4]) * 100).toFixed(2);
            growth3Day = growth3Day + "%";
          }
          if (casesToday[7] && casesToday[1]) {
            growth7Day = (((casesToday[1] - casesToday[7]) / casesToday[7]) * 100).toFixed(2);
            growth7Day = growth7Day + "%";
          }
  
          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          const speakOutput = requestAttributes.t("GROWTH_MSG", {growth1Day: growth1Day, growth3Day: growth3Day, growth7Day: growth7Day, subIntent: subIntent});
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(requestAttributes.t("GROWTH_TITLE"),
              speakOutput)
            .getResponse();
        }
        else {
          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          const speakOutput = requestAttributes.t("GROWTH_NOTFOUND_MSG", {subIntent: subIntent});
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(requestAttributes.t("GROWTH_TITLE"),
              speakOutput)
            .getResponse();        
        }
      }).catch(function(err) {
        return "ERROR: something went wrong calling dynamodb with error: " + JSON.stringify(err.message, null, 2);
      });
    }
  }
};

/* *
 * covid report intent handler
 * */
const CovidReportIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'report';
  },
  handle(handlerInput) {
    // get region requested
    const slotCountry = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_country');
    const slotState = Alexa.getSlotValue(handlerInput.requestEnvelope, 'slot_state');

    let regionDate7 = new Date((new Date()).setDate((new Date()).getDate() - 7)).toISOString().slice(0, -14); // 7 days ago

    // default
    let subIntent = "the world";

    let getParams = {
      TableName: CONFIG.TABLE_COUNTRY,
      FilterExpression: "record_dtm >= :record_dtm",
      ExpressionAttributeValues: {
        ":record_dtm": regionDate7
      },
      ScanIndexForward: false
    };

    // country check
    if (slotCountry && slotCountry !== null && slotCountry !== "") {
      // cleanup
      let slotCountryRev = slotCountry.toLowerCase().replace("the ", ""); // will need to make language specific
      // country mapping
      slotCountryRev = standardizeCountry.standardizeCountryName(slotCountryRev);

      subIntent = slotCountryRev;

      getParams = {
        TableName: CONFIG.TABLE_COUNTRY,
        KeyConditionExpression: "record_dtm >= :record_dtm and country = :country",
        ExpressionAttributeValues: {
          ":record_dtm": regionDate7,
          ":country": slotCountryRev
        },
        ScanIndexForward: false
      };
    }
    // state check
    else if (slotState && slotState !== null && slotState !== "") {
      let slotStateRev = slotState.toLowerCase();
      subIntent = slotStateRev;

      getParams = {
        TableName: CONFIG.TABLE_STATE,
        KeyConditionExpression: "record_dtm >= :record_dtm and #state = :state",
        ExpressionAttributeNames: {"#state" : "state"},
        ExpressionAttributeValues: {
          ":record_dtm": regionDate7,
          ":state": slotStateRev
        },
        ScanIndexForward: false
      };
    }

    if (subIntent === "the world") {
      // retrieve data
      return dynamodbDoc.scan(getParams).promise().then(function(data) {
        let casesToday = {};
        let casesNew = 0;
        let casesAll = 0;
        let deathsNew = 0;
        let casesActive = 0;
        let deathsAll = 0;

        let date1Day = new Date((new Date()).setDate((new Date()).getDate() - 1)).toISOString().slice(0, -14); // 1 day ago
        let date4Day = new Date((new Date()).setDate((new Date()).getDate() - 4)).toISOString().slice(0, -14); // 4 day ago
  
        if (data.Items.length > 0) {
          data.Items.forEach(function(item) {
            if (!(casesToday[item.record_dtm])) {
              casesToday[item.record_dtm] = 0;
            }
            casesToday[item.record_dtm] += item.todayCases;

            if (item.record_dtm === date1Day && item.todayCases) {
               casesNew += item.todayCases;
            }
            if (item.record_dtm === date1Day && item.todayDeaths) {
               deathsNew += item.todayDeaths;
            }
            if (item.record_dtm === date1Day && item.active) {
               casesActive += item.active;
            }
            if (item.record_dtm === date1Day && item.deaths) {
              deathsAll += item.deaths;
            }
            if (item.record_dtm === date1Day && item.cases) {
              casesAll += item.cases;
            }
          });

          let growth3Day = "an unknown %";

          if (casesToday[date4Day] && casesToday[date1Day]) {
            growth3Day = (((casesToday[date1Day] - casesToday[date4Day]) / casesToday[date4Day]) * 100).toFixed(2);
            growth3Day = growth3Day + "%";
          }
          const mortalityAll = ((deathsAll / casesAll) * 100).toFixed(2);

//REPORT_MSG : 'Yesterday there were {{casesNew}} new cases, {{deathsNew}} new deaths, and a total of {{casesActive}} active cases in {{subIntent}}.  {{subIntent}} has seen a new case growth rate of {{growth3Day}} in the past 3 days and a overall mortality rate of {{mortalityAll}}%.',

          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          const speakOutput = requestAttributes.t("REPORT_MSG", {casesNew:  casesNew, deathsNew: deathsNew, casesActive: casesActive, growth3Day: growth3Day, mortalityAll: mortalityAll, subIntent: subIntent});
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(requestAttributes.t("REPORT_TITLE"),
              speakOutput)
            .getResponse();
        }
        else {
          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          const speakOutput = requestAttributes.t("GROWTH_NOTFOUND_MSG", {subIntent: subIntent});
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(requestAttributes.t("GROWTH_TITLE"),
              speakOutput)
            .getResponse();        
        }
      }).catch(function(err) {
        return "ERROR: something went wrong calling dynamodb with error: " + JSON.stringify(err.message, null, 2);
      });
    }
    else {
      // retrieve data
      return dynamodbDoc.query(getParams).promise().then(function(data) {
        let casesToday = {};
        let casesNew = 0;
        let casesAll = 0;
        let deathsNew = 0;
        let casesActive = 0;
        let deathsAll = 0;

        let date1Day = new Date((new Date()).setDate((new Date()).getDate() - 1)).toISOString().slice(0, -14); // 1 day ago

        if (data.Items.length > 0) {
          let i = 0;
          data.Items.forEach(function(item) {
            if (item.todayCases) {
              casesToday[i] = item.todayCases;
              i++;
            }

            if (item.record_dtm === date1Day && item.todayCases) {
               casesNew += item.todayCases;
            }
            if (item.record_dtm === date1Day && item.todayDeaths) {
               deathsNew += item.todayDeaths;
            }
            if (item.record_dtm === date1Day && item.active) {
               casesActive += item.active;
            }
            if (item.record_dtm === date1Day && item.deaths) {
              deathsAll += item.deaths;
            }
            if (item.record_dtm === date1Day && item.cases) {
              casesAll += item.cases;
            }
          });

          let growth3Day = "an unknown %";

          if (casesToday[4] && casesToday[1]) {
            growth3Day = (((casesToday[1] - casesToday[4]) / casesToday[4]) * 100).toFixed(2);
            growth3Day = growth3Day + "%";
          }
          const mortalityAll = ((deathsAll / casesAll) * 100).toFixed(2);

          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          const speakOutput = requestAttributes.t("REPORT_MSG", {casesNew:  casesNew, deathsNew: deathsNew, casesActive: casesActive, growth3Day: growth3Day, mortalityAll: mortalityAll, subIntent: subIntent});
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(requestAttributes.t("REPORT_TITLE"),
              speakOutput)
            .getResponse();
        }
        else {
          const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
          const speakOutput = requestAttributes.t("GROWTH_NOTFOUND_MSG", {subIntent: subIntent});
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(requestAttributes.t("GROWTH_TITLE"),
              speakOutput)
            .getResponse();        
        }
      }).catch(function(err) {
        return "ERROR: something went wrong calling dynamodb with error: " + JSON.stringify(err.message, null, 2);
      });
    }
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MSG'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MSG'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT'))
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MSG'))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MSG'))
      .reprompt(requestAttributes.t('ERROR_MSG'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    // Gets the locale from the request and initializes i18next.
    const localizationClient = i18n.init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
      returnObjects: true
    });
    // Creates a localize function to support arguments.
    localizationClient.localize = function localize() {
      // gets arguments through and passes them to
      // i18next using sprintf to replace string placeholders
      // with arguments.
      const args = arguments;
      const value = i18n.t(...args);
      // If an array is used then a random value is selected
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    // this gets the request attributes and save the localize function inside
    // it to be used in a handler by calling requestAttributes.t(STRING_ID, [args...])
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    }
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
    CovidCasesIntentHandler,
    CovidMortalityIntentHandler,
    CovidGrowthIntentHandler,
    CovidReportIntentHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/basic-fact/v2')
  .lambda();
