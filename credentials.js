// Initialize Firebase
var config = {
  apiKey: "AIzaSyCuon7WUdd609Y85oBJJbD8ul3eGoO8RDs",
  authDomain: "flutter-flip-card.firebaseapp.com",
  databaseURL: "https://flutter-flip-card.firebaseio.com",
  projectId: "flutter-flip-card",
  storageBucket: "flutter-flip-card.appspot.com",
  messagingSenderId: "186673725150",
  appId: "1:186673725150:web:2e45457bb4499811f30c4f",
  measurementId: "G-K5QTK9Y7PD"
};
firebase.initializeApp(config);

function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.location = 'home.html';
    } else {
      document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('user-detail').textContent = '';
    }
    document.getElementById('quickstart-button').disabled = false;
  });

  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}


/**
 * Starts the sign-in process.
 */
async function startSignIn() {
  document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    chrome.extension.getBackgroundPage().signInWithPopup();
  }
}

window.onload = function() {
  initApp();
};
