// TODO: get user info with sending msg to background
function initApp() {
    document.getElementById('signout-button').addEventListener('click', signOut, false);
    document.getElementById('submit-button').addEventListener('click', submitWord, false);
    document.getElementById('translate-button').addEventListener('click', translateWord, false);
}

function translateWord(){
    const word = document.getElementById('native-word').value
    if (word)
        chrome.extension.getBackgroundPage().translateWordForPopup(word);
}

function submitWord() {
    var nativeWord = document.getElementById('native-word').value;
    const foreignWord = document.getElementById('foreign-word').value;
    chrome.runtime.sendMessage({object: 'insertWord', nativeWord: nativeWord, foreignWord: foreignWord});
    document.getElementById('native-word').value = "";
    document.getElementById('foreign-word').value = "";
}

function signOut() {
    chrome.extension.getBackgroundPage().signOut();
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.object == 'signIn' && !request.user) {
            window.location = 'credentials.html';
        } else if(request.object == 'translate'){
            document.getElementById('foreign-word').value = request.word;
        }
    })

window.onload = function() {
    initApp();
};