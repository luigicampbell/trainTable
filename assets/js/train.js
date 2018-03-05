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

// Authentication Registration
$(".register form").on("submit", function(event){
  // Allows user to press enter to submit
  event.preventDefault();
  // Takes values stored in register, email and password fields
  var email = $(".register .email").val();
  var password = $(".register .password").val();

  // Firebase Authentication documentation
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(user){
    console.log(user);
  })
  .catch(function(err){
    console.log(err);
  });

});

// Authentication Login
$(".login form").on("submit", function(event){
  event.preventDefault();
  var email = $(".login .email").val();
  var password = $(".login .password").val();

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(user) {
    console.log(user);
  })
  .catch(function(err){
    console.log(err);
  });

});

firebase.auth().onAuthStateChanged(function(user){
  if (user){
    console.log(`Welcome ${user.name}!`);

    // Ended up deleted for some reason
    var database = firebase.database();

    // 2. Button for adding Trains
    $("#add-train-btn").on("click", function(event) {

      // Grabs user input
      let trainName = $("#train-name-input").val().trim();
      let trainDestination = $("#destination-input").val().trim();
      let trainArrival = moment($("#arrival-input").val().trim(), "HH:mm").format("X");
      let trainFrequency = $("#frequency-input").val().trim();
      let blah = "blah";
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

      // Store everything into a variable
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
      console.log(`Train Name: ${trainName}`);
      console.log(`Train Destination: ${trainDestination}`);
      console.log(`Train Frequency: ${trainFrequency}`);
      console.log(`Arrival Time: ${trainArrival}`);

      // Add each train's data into the table
      $("#train-table > tbody").append(`<tr><td>${trainName}</td><td> ${trainDestination}</td><td style="text-align:center">${trainFrequency} mins</td><td style="text-align:center">${moment(nextTrain).format("hh:mm")}</td><td style="text-align:center">in ${minutesToNextTrain} mins</td><tr>`);
    })
  }
  else{
    console.log(`Please logon to proceed`);
  }
});
