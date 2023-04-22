// Initialize Firebase
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  firebase.initializeApp(firebaseConfig);
  
  // Get a reference to the Firebase Auth service
  var auth = firebase.auth();
  
  // Create a new user account with email and password
  function signUp() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var phone = document.getElementById("phone").value;
  
    // Check if email is a Berkeley email
    if (!email.endsWith("@berkeley.edu")) {
      alert("Please use a Berkeley email address.");
      return;
    }
  
    auth.createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // Update the user profile with the phone number
        userCredential.user.updateProfile({
          phoneNumber: phone
        }).then(function() {
          alert("Account created successfully!");
        }).catch(function(error) {
          alert("Error updating user profile: " + error.message);
        });
      })
      .catch(function(error) {
        alert("Error creating account: " + error.message);
      });
  }
  
  // Log in with an existing email and password
  function logIn() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
      .then(function() {
        alert("Logged in successfully!");
      })
      .catch(function(error) {
        alert("Error logging in: " + error.message);
      });
  }

//this function will create a group in the database with a maximum of 4 members, specifying the airport, time, and the area of meet
function createGroup() {
    var airport = document.getElementById("airport").value;
    var time = document.getElementById("time").value;
    var area = document.getElementById("area").value;
    var group = document.getElementById("group").value;
    var members = document.getElementById("members").value;
    var groupRef = firebase.database().ref('groups/' + group);
    groupRef.set({
        airport: airport,
        time: time,
        area: area,
        members: members
    });
} 

//this function will add a member to a group
function addMember() {
    var group = document.getElementById("group").value;
    var members = document.getElementById("members").value;
    var groupRef = firebase.database().ref('groups/' + group);
    groupRef.update({
        members: members
    });
}

