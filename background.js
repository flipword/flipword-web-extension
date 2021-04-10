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
      if(user) {
          console.log('have user');
          chrome.browserAction.setPopup({ popup: "home.html"});
      } else {
          console.log('not have user');
          chrome.browserAction.setPopup({ popup: "credentials.html"});
      }
      chrome.runtime.sendMessage({object: 'signIn', user: !!user});
  });
}

// TODO: env var login_hint
function signInWithPopup(){
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    'login_hint': '186673725150-jnvblj3u6a3ndbed71go1t7l09nq3psl.apps.googleusercontent.com'
  });
  return firebase.auth().signInWithPopup(provider)
      .then((result) => {
        return result
      })
      .catch((error) => {
        console.log(error)});
}

function signOut() {
    firebase.auth().signOut();
}

function insertCard(nativeWord, foreignWord) {
  const userId = firebase.auth().currentUser.uid;
  firebase.firestore().collection('dictionary').doc(userId).collection('fr-en').add({nativeWord: nativeWord, foreignWord: foreignWord})
    .catch(() => {console.error()})
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        title: 'Add to your FlipWord collection',
        contexts: ['selection'],
    });
});


chrome.contextMenus.onClicked.addListener(function () {
    chrome.tabs.executeScript({
        file: 'hoverPopup.js'
    });
    chrome.tabs.insertCSS({
        file: 'hoverPopup.css'
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.object == 'insertWord' && !!request.nativeWord && !!request.foreignWord){
          insertCard(request.nativeWord, request.foreignWord);
          sendResponse({success: true});
      } else if(request.object == 'insertWord') {
          sendResponse({success: false});
      } else if(request.object == 'getUser') {
          sendResponse({user: firebase.auth().currentUser.email});
      }
    }
);

window.onload = function() {
  initApp();
};