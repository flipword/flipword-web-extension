function initApp() {
    document.getElementById('submit-button').addEventListener('click', submitWord, false);
    document.getElementById('translate-button').addEventListener('click', translateWord, false);
    document.getElementById('setting-button').addEventListener('click', openOption, false);
    chrome.runtime.sendMessage({object: "getCurrentLanguages"}, function(response) {
        const nativeLanguageLabel = response.currentLanguages.nativeLanguageLabel
        const foreignLanguageLabel = response.currentLanguages.foreignLanguageLabel
        document.getElementById('native-word-label').innerText = `${nativeLanguageLabel}:`
        document.getElementById('foreign-word-label').innerText = `${foreignLanguageLabel}:`
    });
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
        if(request.object == 'translate'){
            document.getElementById('foreign-word').value = request.word;
        }
    })

window.onload = function() {
    initApp();
};