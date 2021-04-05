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

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var email = user.email;
      document.getElementById('quickstart-button').textContent = 'Sign out';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      document.getElementById('user-detail').textContent = `Current user: ${email}`;
    } else {
      // Let's try to get a Google auth token programmatically.
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
    const bgPage = chrome.extension.getBackgroundPage();
    bgPage.signInWithPopup();
  }
}

window.onload = function() {
  initApp();
};
