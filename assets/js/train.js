/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the minutes away using difference between frequency and next arrival.
// 5. Then use moment.js formatting to set arrival time.


// 1. Initialize Firebase
let config = {
  apiKey: "AIzaSyBmCE6avmFuqEPrYs2_0FG9xALs4J3Zw9o",
  authDomain: "choochoo-4076b.firebaseapp.com",
  databaseURL: "https://choochoo-4076b.firebaseio.com",
  projectId: "choochoo-4076b",
  storageBucket: "choochoo-4076b.appspot.com",
  messagingSenderId: "532821342736"
};
firebase.initializeApp(config);

let database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  let trainName = $("#train-name-input").val().trim();
  let trainDestination = $("#destination-input").val().trim();
  let trainFrequency = $("#frequency-input").val().trim();
  let trainArrival = moment($("#arrival-input").val().trim(), "HH:mm").format("X");

  // Creates local "ttrainorary" object for holding train data
  let newTrain = {
    name: trainName,
    destination: trainDestination,
    frequency: trainFrequency,
    arrival: trainArrival
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.frequency);
  console.log(newTrain.arrival);

  // Alert
  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#arrival-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a letiable.
  let trainName = childSnapshot.val().name;
  let trainDestination = childSnapshot.val().destination;
  let trainFrequency = childSnapshot.val().frequency;
  let trainArrival = childSnapshot.val().arrival;

  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFrequency);
  console.log(trainArrival);

  // Prettify the train frequency
  // let trainFrequencyPretty = moment.unix(trainFrequency).format("MM/DD/YY");

  // Calculate the months worked using hardcore math
  // To calculate the months worked
  // let trainMonths = moment().diff(moment.unix(trainFrequency, "X"), "months");
  // console.log(trainMonths);
  //
  // // Calculate the total billed arrival
  // let trainBilled = trainMonths * trainArrival;
  // console.log(trainBilled);

$("#train-table > tbody").append("<tr><td>" + trainName + "</td></tr>");
  // Add each train's data into the table
  // $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  // trainFrequencyPretty + "</td><td>" + trainMonths + "</td><td>" + trainArrival + "</td><td>" + trainBilled + "</td></tr>");
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume train frequency date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any atttraint we use mets this test case
