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

const translateBaseUrl = 'https://api.cognitive.microsofttranslator.com/translate';

// Init translate service
const Http = new XMLHttpRequest();

// User infos
let user = null;
let currentLanguage = {nativeLanguageLabel: null, foreignLanguageLabel: null};

async function initApp() {
    await firebase.auth().onAuthStateChanged(async function(user) {
      if(user) {
          await getLanguages();
          await getUser();
          chrome.browserAction.setPopup({ popup: "home/home.html"});
      } else {
          chrome.browserAction.setPopup({ popup: "credentials/credentials.html"});
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
  firebase.auth().signInWithPopup(provider)
      .catch((error) => {
        console.log(error)});
}

async function getUser(){
    const userId = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('profile').doc(userId).get().then((res) => {
        user = res.data();
        chrome.runtime.sendMessage({object: 'userUpdated', user: user});
        getCurrentLanguage()
        return;
    }).catch((err) => {
        console.log("error:", err)
    });
}

async function getLanguages(){
    await chrome.storage.local.get(['languages'], async function(result) {
        if(!result){
            await firebase.firestore().collection('language').get().then((res) => {
                const languages = res.docs.map((elem) => elem.data());
                chrome.storage.local.set({languages: languages});
                return;
            }).catch((err) => {
                console.log("error:", err);
            });
        }
    });
}

function getCurrentLanguage(){
    chrome.storage.local.get(['languages'], function(result) {
        result.languages.forEach((elem) => {
            if(elem.isoCode == user.nativeLanguageIsoCode){
                currentLanguage.nativeLanguageLabel = elem.label;
            } else if (elem.isoCode == user.foreignLanguageIsoCode){
                currentLanguage.foreignLanguageLabel = elem.label;
            }
        });
    })
}

function updateNativeLanguage(language){
    const userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('profile').doc(userId).update({'nativeLanguageIsoCode': language})
        .then(() => getUser())
}

function updateForeignLanguage(language){
    const userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('profile').doc(userId).update({'foreignLanguageIsoCode': language})
        .then(() => getUser())
}

function insertCard(nativeWord, foreignWord) {
  const userId = firebase.auth().currentUser.uid;
  firebase.firestore().collection('dictionary').doc(userId)
      .collection(`${user.nativeLanguageIsoCode}-${user.foreignLanguageIsoCode}`)
      .add({
          nativeWord: nativeWord[0].toUpperCase()+nativeWord.substr(1),
          foreignWord: foreignWord[0].toUpperCase()+foreignWord.substr(1),
          nbSuccess: 0,
          nbErrors: 0
      })
    .catch(() => {console.error()})
}

function translateWordForPopup(word) {
    const queryParam = `?from=${user.nativeLanguageIsoCode}&to=${user.foreignLanguageIsoCode}&api-version=3.0`
    Http.open('POST', translateBaseUrl+queryParam);
    Http.setRequestHeader('Ocp-Apim-Subscription-Key', 'cc66c8aff9574a8ebbc3d02e5a42f0a8');
    Http.setRequestHeader('Ocp-Apim-Subscription-Region','francecentral');
    Http.setRequestHeader('Content-Type', 'application/json');
    Http.send(`[{"Text":"${word}"}]`);
    Http.onreadystatechange = function () {
        if(Http.readyState == 4){
            const response = JSON.parse(Http.responseText);
            const word = response[0].translations[0].text
            chrome.runtime.sendMessage({object: 'translate', word: word});
        }
    }
}

function displayHoverPopup(foreignWord) {
    const queryParam = `?from=${user.foreignLanguageIsoCode}&to=${user.nativeLanguageIsoCode}&api-version=3.0`
    Http.open('POST', translateBaseUrl+queryParam);
    Http.setRequestHeader('Ocp-Apim-Subscription-Key', 'cc66c8aff9574a8ebbc3d02e5a42f0a8');
    Http.setRequestHeader('Ocp-Apim-Subscription-Region','francecentral');
    Http.setRequestHeader('Content-Type', 'application/json');
    Http.send(`[{"Text":"${foreignWord}"}]`);
    Http.onreadystatechange = function () {
        if(Http.readyState == 4){
            const response = JSON.parse(Http.responseText);
            const nativeWord = response[0].translations[0].text
            const params = {
                nativeWord: nativeWord,
                foreignWord: foreignWord,
                nativeLanguageLabel: currentLanguage.nativeLanguageLabel,
                foreignLanguageLabel: currentLanguage.foreignLanguageLabel
            }
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                chrome.tabs.executeScript(tabs[0].id, {
                    code: `var params = ${JSON.stringify(params)}`
                }, function() {
                    chrome.tabs.executeScript(tabs[0].id, {
                        file: 'content-scripts/hoverPopup.js',
                    });
                });
                chrome.tabs.insertCSS(tabs[0].id, {
                    file: 'content-scripts/hoverPopup.css'
                });
            });
        }
    }
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
          getUser();
      } else if(request.object == 'requestTranslate' && request.from == 'contentScript') {
          translateWordForContentScript(request.word)
      } else if(request.object == 'displayPopup'){
          displayHoverPopup(request.selection);
      } else if(request.object == 'getCurrentLanguages'){
          sendResponse({currentLanguages: currentLanguage});
      } else if(request.object == 'updateNativeLanguage'){
          updateNativeLanguage(request.languageIsoCode)
      } else if(request.object == 'updateForeignLanguage'){
          updateForeignLanguage(request.languageIsoCode)
      }
    }
);

chrome.webNavigation.onCompleted.addListener(function(details) {
    if(details.url.startsWith('http') || details.url.startsWith('https')){
        chrome.storage.local.get(['popupButtonChecked'], function(result) {
            if(!!JSON.stringify(result.popupButtonChecked) && result.popupButtonChecked) {
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
    }
})

window.onload = async function() {
    await initApp();
};