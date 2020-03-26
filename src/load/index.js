const awsDynamoDB = require("aws-sdk/clients/dynamodb");
const dynamodbDoc = new awsDynamoDB.DocumentClient();
const https = require('https');
const CONFIG = {'covid_country_url':'https://corona.lmao.ninja/countries',
                'covid_state_url':'https://corona.lmao.ninja/states'};

var recordLoadDate = "";
var recordDate = "";

exports.handler = async (event) => {
  recordLoadDate = new Date().toISOString().slice(0, -5);
  recordDate = new Date().toISOString().slice(0, -14);
  
  let countries = await loadState();
  return loadCountry(countries);
}

function loadCountry() {
  return httpsRequest(CONFIG.covid_country_url).then(async (response) => {
    let jsonRecords = JSON.parse(response.toString());
    let countrySuccess = 0;
    let countryFailure = 0;
    let countryAttemptCount = jsonRecords.length;

    // format records for batchwrite
    var recordArray = [];

    for (let i = 0; i < jsonRecords.length; i++) {
      let record = jsonRecords[i];
      record.record_dtm = recordDate;
      record.load_dtm = recordLoadDate;
      record.country = record.country.toLowerCase();

      let recordObj = {
        PutRequest: {
          Item: record
        }
      };
      recordArray.push(recordObj);

      if (recordArray.length === 20 || i === jsonRecords.length - 1) {
        // add/update user data
        var addDataParams = {
          RequestItems: {
            'covid_country': recordArray
          }
        };

        // add/update user records
        try {
             await dynamodbDoc.batchWrite(addDataParams).promise().then(function(data) {
               countrySuccess += recordArray.length;
             });
        }
        catch (e) {
          countryFailure += recordArray.length;
          console.log(e.message);
          console.log("country load attempt total: " + countryAttemptCount + "; success: " + countrySuccess + "; failure:" + countryFailure);
        }
        recordArray.length = 0;
      }
    }
    console.log("country load attempt total: " + countryAttemptCount + "; success: " + countrySuccess + "; failure:" + countryFailure);
    return "successfully loaded";
  }).catch((err) => {
    return "ERROR: something went wrong calling the country endpoint with error: " + JSON.stringify(err.message, null, 2);
  });
}

function loadState() {
  return httpsRequest(CONFIG.covid_state_url).then(async (response) => {
    let jsonRecords = JSON.parse(response.toString());
    let stateSuccess = 0;
    let stateFailure = 0;
    let stateAttemptCount = jsonRecords.length;

    // format records for batchwrite
    var recordArray = [];

    for (let i = 0; i < jsonRecords.length; i++) {
      let record = jsonRecords[i];
      record.record_dtm = recordDate;
      record.load_dtm = recordLoadDate;
      record.state = record.state.toLowerCase();

      let recordObj = {
        PutRequest: {
          Item: record
        }
      };
      recordArray.push(recordObj);

      if (recordArray.length === 20 || i === jsonRecords.length - 1) {
        // add/update user data
        var addDataParams = {
          RequestItems: {
            'covid_state': recordArray
          }
        };

        // add/update user records
        try {
             await dynamodbDoc.batchWrite(addDataParams).promise().then(function(data) {
               stateSuccess += recordArray.length;
             });
        }
        catch (e) {
          stateFailure += recordArray.length;
          console.log(e.message);
          console.log("state load attempt total: " + stateAttemptCount + "; success: " + stateSuccess + "; failure:" + stateFailure);
        }
        recordArray.length = 0;
      }
    }
    console.log("state load attempt total: " + stateAttemptCount + "; success: " + stateSuccess + "; failure:" + stateFailure);
    return "successfully loaded";
  }).catch((err) => {
    return "ERROR: something went wrong calling the https endpoint with error: " + JSON.stringify(err.message, null, 2);
  });
}


function httpsRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      var body = [];

      res.on('data', function(chunk) {
        body.push(chunk);
      });
      
      res.on('end', function() {
        try {
          body = Buffer.concat(body).toString();
        } catch(e) {
          reject(e);
        }
        resolve(body);
      });
    });
  
    req.on('error', (e) => {
      reject(e.message);
    });
    // send the request
    req.end();
  });
}
