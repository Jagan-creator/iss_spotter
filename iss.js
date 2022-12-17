const request = require('request');

///////////////////////////

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

///////////////////////////

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {    //catching any inital errors
      callback(error, null);
      return;
    }

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {    //testing to see if the JSON.parse was successful
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    } 

    const { latitude, longitude } = parsedBody;
    callback(null, {latitude, longitude});    //callback to return the lat and long object

  });
};

///////////////////////////


module.exports = { fetchMyIP };
module.exports = { fetchCoordsByIP };