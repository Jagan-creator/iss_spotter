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

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {    //catch any initial errors
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {    //making sure response from destination url is successful or not
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);   //callback to return our pass times from the url

  });
};

///////////////////////////

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);   //first callback
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);   //second callback
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);   //third callback
        }

        callback(null, nextPasses);   //final callback if none of the other inital callbacks trigger
      });
    });
  });
};

module.exports = { fetchMyIP };
module.exports = { fetchCoordsByIP };
module.exports = { fetchISSFlyOverTimes };
module.exports = { nextISSTimesForMyLocation };