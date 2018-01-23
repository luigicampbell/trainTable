let militaryTimeConverted;
let timeDifference;
let currentTime;
let timeApart;
let nextTrain;
let minutesToNextTrain;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBYVQ3zFv-596GELNTp3dadHQmKlwnbdrM",
  authDomain: "two-choo.firebaseapp.com",
  databaseURL: "https://two-choo.firebaseio.com",
  projectId: "two-choo",
  storageBucket: "two-choo.appspot.com",
  messagingSenderId: "1004164577996"
};
firebase.initializeApp(config);

// Ended up deleted for some reason
var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  let trainName = $("#train-name-input").val().trim();
  let trainDestination = $("#destination-input").val().trim();
  let trainArrival = moment($("#arrival-input").val().trim(), "HH:mm").format("X");
  let trainFrequency = $("#frequency-input").val().trim();
  // Logging values for form inputs
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainArrival);
  console.log(trainFrequency);

  // Creates local object for holding train data
  let newTrain = {
    trainName: trainName,
    trainDestination: trainDestination,
    trainFrequency: trainFrequency,
    trainArrival: trainArrival,
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.trainDestination);
  console.log(newTrain.trainFrequency);
  console.log(newTrain.trainArrival);

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
  let trainName = childSnapshot.val().trainName;
  let trainDestination = childSnapshot.val().trainDestination;
  let trainArrival = childSnapshot.val().trainArrival;
  let trainFrequency = childSnapshot.val().trainFrequency;

  // Access Keys
  trainFrequency = trainFrequency;
  militaryTime = trainArrival;

  // Convert Military Time
  militaryTimeConverted = moment(militaryTime, "hh:mm").subtract(1, "year");

  // Current Time
  currentTime=moment();
  // Difference in time
  timeDifference = moment().diff(moment(militaryTimeConverted), "minutes");

  // Time apart
  timeApart=timeDifference%trainFrequency;

  // minutes until next train
  minutesToNextTrain=trainFrequency-timeApart;

  // next train
  nextTrain=moment().add(minutesToNextTrain, "minutes");

  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFrequency);
  console.log(trainArrival);

  // Add each train's data into the table
  $("#train-table > tbody").append(`<tr><td>${trainName}</td><td> ${trainDestination}</td><td style="text-align:center">${trainFrequency} mins</td><td style="text-align:center">${moment(nextTrain).format("hh:mm")}</td><td style="text-align:center">in ${minutesToNextTrain} mins</td><tr>`);
});
