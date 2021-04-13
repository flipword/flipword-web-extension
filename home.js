function initApp() {
    document.getElementById('submit-button').addEventListener('click', submitWord, false);
    document.getElementById('translate-button').addEventListener('click', translateWord, false);
    document.getElementById('setting-button').addEventListener('click', openOption, false);

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

function openOption() {
    chrome.runtime.openOptionsPage()
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