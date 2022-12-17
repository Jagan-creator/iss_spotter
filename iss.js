const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    
    if (error) return callback(error, null);    //checks for initial error returns

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);    //show error status if the error does happen
      return;
    }

    const ip = JSON.parse(body).ip;   //set ip to our parse object
    callback(null, ip);   //callback initiated here

  });
};

module.exports = { fetchMyIP };