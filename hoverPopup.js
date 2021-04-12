var selection = window.getSelection().toString();

var inputNativeWord = document.createElement("input")
var labelInputNativeWord = document.createElement("label")
inputNativeWord.id = "flip-word-input-native-word"
inputNativeWord.className = "flip-word-input-word"
inputNativeWord.name = "flip-word-input-native-word"
inputNativeWord.type = "text"
labelInputNativeWord.htmlFor = "flip-word-input-native-word"
labelInputNativeWord.innerText = "Native word:"

var inputForeignWord = document.createElement("input")
var labelInputForeignWord = document.createElement("label")
inputForeignWord.id = "flip-word-input-foreign-word"
inputForeignWord.name = "flip-word-input-foreign-word"
inputForeignWord.className = "flip-word-input-word"
inputForeignWord.type = "text"
inputForeignWord.value = selection
labelInputForeignWord.htmlFor = "flip-word-input-foreign-word"
labelInputForeignWord.innerText = "Foreign word:"

var submitButton = document.createElement("button")
submitButton.innerText = "Submit"
submitButton.addEventListener('click', submitWord, false);

var closeButton = document.createElement("button")
closeButton.innerText = "Close"
closeButton.addEventListener('click', closePopup, false);

var divContainer = document.createElement("div")
divContainer.id = "flip-word-hover-popup-container"
divContainer.appendChild(labelInputNativeWord)
divContainer.appendChild(inputNativeWord)
divContainer.appendChild(labelInputForeignWord)
divContainer.appendChild(inputForeignWord)
divContainer.appendChild(submitButton)
divContainer.appendChild(closeButton)
divContainer.onclick = (event) => {event.stopPropagation()}
document.body.appendChild(divContainer)

function closePopup() {
    const elementToDelete = document.getElementById("flip-word-hover-popup-container");
    if(elementToDelete)
        elementToDelete.remove();
}

function submitWord() {
    chrome.runtime.sendMessage({object: 'insertWord', nativeWord: inputNativeWord.value, foreignWord: inputForeignWord.value});
    closePopup()
}

chrome.runtime.sendMessage({object: 'requestTranslate', from: 'contentScript', word: selection});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.object == 'translate'){
            inputNativeWord.value = request.word;
        }
    })

window.onclick = function () {
    closePopup()
}