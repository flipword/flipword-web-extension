// Initialize Firebase
const config = {
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

// Init translate service
const Http = new XMLHttpRequest();

// User infos
let user = null;

function initApp() {
    console.log('init background');
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
          chrome.browserAction.setPopup({ popup: "home/home.html"});
      } else {
          chrome.browserAction.setPopup({ popup: "credentials/credentials.html"});
      }
      chrome.runtime.sendMessage({object: 'signIn', user: !!user});
    });
    getLanguage();
}

// TODO: env var login_hint
function signInWithPopup(){
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    'login_hint': '186673725150-jnvblj3u6a3ndbed71go1t7l09nq3psl.apps.googleusercontent.com'
  });
  firebase.auth().signInWithPopup(provider)
      .then(() => {
        getUser();
      })
      .catch((error) => {
        console.log(error)});
}

function getUser(){
    const userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('profile').doc(userId).get().then((res) => {
        user = res.data();
        chrome.runtime.sendMessage({object: 'userUpdated', user: user});
    }).catch((err) => {
        console.log("error:", err)
    });
}

function getLanguage(){
    firebase.firestore().collection('language').get().then((res) => {
        console.log('languages: ',res.docs.map((elem) => elem.data()))
    }).catch((err) => {
        console.log("error:", err)
    });
}

function insertCard(nativeWord, foreignWord) {
  const userId = firebase.auth().currentUser.uid;
  firebase.firestore().collection('dictionary').doc(userId).collection('fr-en').add({nativeWord: nativeWord, foreignWord: foreignWord, nbSuccess: 0, nbErrors: 0})
    .catch(() => {console.error()})
}

// TODO: refacto translate method
function translateWordForPopup(word) {
    const baseUrl = 'https://api.cognitive.microsofttranslator.com/translate';
    const queryParam = '?from=fr&to=en&api-version=3.0'
    Http.open('POST', baseUrl+queryParam);
    Http.setRequestHeader('Ocp-Apim-Subscription-Key', 'cc66c8aff9574a8ebbc3d02e5a42f0a8');
    Http.setRequestHeader('Ocp-Apim-Subscription-Region','francecentral');
    Http.setRequestHeader('Content-Type', 'application/json');
    Http.send(`[{"Text":"${word}"}]`);
    Http.onreadystatechange = function () {
        if(Http.readyState == 4){
            const response = JSON.parse(Http.responseText);
            const word = response[0].translations[0].text
            console.log('send translate:', word)
            chrome.runtime.sendMessage({object: 'translate', word: word});
        }
    }
}

function translateWordForContentScript(word) {
    const baseUrl = 'https://api.cognitive.microsofttranslator.com/translate';
    const queryParam = '?from=en&to=fr&api-version=3.0'
    Http.open('POST', baseUrl+queryParam);
    Http.setRequestHeader('Ocp-Apim-Subscription-Key', 'cc66c8aff9574a8ebbc3d02e5a42f0a8');
    Http.setRequestHeader('Ocp-Apim-Subscription-Region','francecentral');
    Http.setRequestHeader('Content-Type', 'application/json');
    Http.send(`[{"Text":"${word}"}]`);
    Http.onreadystatechange = function () {
        if(Http.readyState == 4){
            const response = JSON.parse(Http.responseText);
            const word = response[0].translations[0].text
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {object: 'translate', word: word});
            });
        }
    }
}

function displayHoverPopup() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            file: 'content-scripts/hoverPopup.js'
        });
        chrome.tabs.insertCSS(tabs[0].id, {
            file: 'content-scripts/hoverPopup.css'
        });
    });
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        title: 'Add to your FlipWord collection',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener(function () {
    displayHoverPopup(null)
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.object == 'insertWord' && !!request.nativeWord && !!request.foreignWord){
          insertCard(request.nativeWord, request.foreignWord);
          sendResponse({success: true});
      } else if(request.object == 'insertWord') {
          sendResponse({success: false});
      } else if(request.object == 'getUser') {
          sendResponse({user: getUser()});
      } else if(request.object == 'requestTranslate' && request.from == 'contentScript') {
          translateWordForContentScript(request.word)
      } else if(request.object == 'displayPopup'){
          displayHoverPopup()
      }
    }
);

chrome.webNavigation.onCompleted.addListener(function(details) {
    if(details.url.startsWith('http') || details.url.startsWith('https')){
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                file: 'content-scripts/buttonPopup.js'
            });
            chrome.tabs.insertCSS(tabs[0].id, {
                file: 'content-scripts/buttonPopup.css'
            });
        });
    }
})
window.onload = function() {
  initApp();
};