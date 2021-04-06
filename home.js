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
    // Listen for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var email = user.email;
            document.getElementById('user-details').textContent = `Current user: ${email}`;
        } else {
            window.location = 'credentials.html';
        }
    });
    document.getElementById('signout-button').addEventListener('click', signOut, false);
    document.getElementById('submit-button').addEventListener('click', submitWord, false);

}

function submitWord() {
    var nativeWord = document.getElementById('native-word').value;
    const foreignWord = document.getElementById('foreign-word').value;
    chrome.runtime.sendMessage({nativeWord: nativeWord, foreignWord: foreignWord}, function(response) {
        console.log("success: ", response.success);
    });
    document.getElementById('native-word').value = "";
    document.getElementById('foreign-word').value = "";
}
function signOut() {
    firebase.auth().signOut();
}

window.onload = function() {
    initApp();
};