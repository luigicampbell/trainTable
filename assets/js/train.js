/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the minutes away using difference between frequency and next arrival.
// 5. Then use moment.js formatting to set arrival time.
let militaryTime;
let frequency;
let militaryTimeConverted;
let timeDifference;
let currentTime;
let timeApart;
let nextTrain;
let minutesToNextTrain;

// 1. Initialize Firebase
let config = {
  apiKey: `AIzaSyBmCE6avmFuqEPrYs2_0FG9xALs4J3Zw9o`,
  authDomain: `choochoo-4076b.firebaseapp.com`,
  databaseURL: `https://choochoo-4076b.firebaseio.com`,
  projectId: `choochoo-4076b`,
  storageBucket: `choochoo-4076b.appspot.com`,
  messagingSenderId: `532821342736`
};
firebase.initializeApp(config);

let database = firebase.database();

// 2. Button for adding Trains
$(`#add-train-btn`).on(`click`, function(event) {
  event.preventDefault();

  // Grabs user input
  let trainName = $(`#train-name-input`).val().trim();
  let trainDestination = $(`#destination-input`).val().trim();
  let trainArrival = moment($(`#arrival-input`).val().trim(), `HH:mm`).format(`X`);
  let trainFrequency = $(`#frequency-input`).val().trim();

  // Creates local `ttrainorary` object for holding train data
  let newTrain = {
    trainName: trainName,
    trainDestination: trainDestination,
    trainFrequency: trainFrequency,
    trainArrival: trainArrival
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.trainDestination);
  console.log(newTrain.trainFrequency);
  console.log(newTrain.trainArrival);

  // Clears all of the text-boxes
  $(`#train-name-input`).val(``);
  $(`#destination-input`).val(``);
  $(`#frequency-input`).val(``);
  $(`#arrival-input`).val(``);
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on(`child_added`, function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a letiable.
  let trainName = childSnapshot.val().trainName;
  let trainDestination = childSnapshot.val().trainDestination;
  let trainArrival = childSnapshot.val().trainArrival;
  let trainFrequency = childSnapshot.val().trainFrequency;

  // Access Keys
  frequency = trainFrequency;
  militaryTime = trainArrival;

  // Convert Military Time
  militaryTimeConverted = moment(militaryTime, `hh:mm`).subtract(1, `years`);

  // Current Time
  currentTime=moment();

  // Difference in time
  timeDifference = moment().diff(moment(militaryTimeConverted), `minutes`);

  // Time apart
  timeApart=timeDifference%frequency;

  // minutes until next train
  minutesToNextTrain=frequency-timeApart;

  // next train
  nextTrain=moment().add(minutesToNextTrain, ` minutes`);

  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFrequency);
  console.log(trainArrival);

  // Add each train's data into the table
  $(`#train-table > tbody`).append(`<tr><td> ${trainName} </td><td> ${trainDestination} </td><td> ${trainFrequency}</td><td> ${moment(nextTrain).format(`hh:mm`)}</td><td> ${minutesToNextTrain}</td><tr>`);
});
