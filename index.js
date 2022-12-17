const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes); //prints out pass times as callback
});

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);             //date here
    datetime.setUTCSeconds(pass.risetime);    //rise time
    const duration = pass.duration;           //for how long
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};