function initApp() {
    document.getElementById('submit-button').addEventListener('click', submitWord, false);
    document.getElementById('translate-button').addEventListener('click', translateWord, false);
    document.getElementById('setting-button').addEventListener('click', openOption, false);
    document.getElementById('train-button').addEventListener('click', redirectToApp, false);
    document.getElementById('swap-button').addEventListener('click', requestSwapLanguage, false);
    setCurrentLanguageLabels()
}

function setCurrentLanguageLabels() {
    console.log("set labell")
    chrome.runtime.sendMessage({object: "loadCurrentLanguages"}, function(response) {
        const nativeLanguageLabel = response.currentLanguages.nativeLanguageLabel
        const foreignLanguageLabel = response.currentLanguages.foreignLanguageLabel
        document.getElementById('native-word-label').innerText = `${nativeLanguageLabel}:`
        document.getElementById('foreign-word-label').innerText = `${foreignLanguageLabel}:`
    });
}
function redirectToApp() {
    window.open('https://app.flipword.io')
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

function requestSwapLanguage() {
    chrome.extension.getBackgroundPage().swapLanguage()
}

function languageSwapped() {
    setCurrentLanguageLabels()
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.object == 'translate'){
            document.getElementById('foreign-word').value = request.word;
        }
        if(request.object == 'languageSwapped'){
            languageSwapped();
        }
        if(request.object == 'languageUpdated'){
            setCurrentLanguageLabels();
        }
    })

window.onload = function() {
    initApp();
};
