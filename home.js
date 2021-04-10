// TODO: get user info with sending msg to background
function initApp() {
    document.getElementById('user-details').textContent = `Current user: `;
    document.getElementById('signout-button').addEventListener('click', signOut, false);
    document.getElementById('submit-button').addEventListener('click', submitWord, false);
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

chrome.runtime.sendMessage({object: 'getUser'}, function (response) {
    document.getElementById('user-details').textContent += `${response.user}`;
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.object == 'signIn' && !request.user) {
            window.location = 'credentials.html';
        }
    })

window.onload = function() {
    initApp();
};