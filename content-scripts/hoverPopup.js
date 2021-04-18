console.log("params: ", params);
const containerNativeWord = document.createElement("div")
containerNativeWord.className = "flip-word-input-container"
const inputNativeWord = document.createElement("input")
const labelInputNativeWord = document.createElement("label")
inputNativeWord.id = "flip-word-input-native-word"
inputNativeWord.className = "flip-word-input-word"
inputNativeWord.name = "flip-word-input-native-word"
inputNativeWord.type = "text"
inputNativeWord.value = params.nativeWord
labelInputNativeWord.htmlFor = "flip-word-input-native-word"
labelInputNativeWord.innerText = `${params.nativeLanguageLabel}:`
containerNativeWord.appendChild(labelInputNativeWord)
containerNativeWord.appendChild(inputNativeWord)

const containerForeignWord = document.createElement("div")
containerForeignWord.className = "flip-word-input-container"
const inputForeignWord = document.createElement("input")
const labelInputForeignWord = document.createElement("label")
inputForeignWord.id = "flip-word-input-foreign-word"
inputForeignWord.name = "flip-word-input-foreign-word"
inputForeignWord.className = "flip-word-input-word"
inputForeignWord.type = "text"
inputForeignWord.value = params.foreignWord
labelInputForeignWord.htmlFor = "flip-word-input-foreign-word"
labelInputForeignWord.innerText = `${params.foreignLanguageLabel}:`
containerForeignWord.appendChild(labelInputForeignWord)
containerForeignWord.appendChild(inputForeignWord)

const containerSubmitButton = document.createElement("div")
containerSubmitButton.className = "flip-word-button-container"
const submitButton = document.createElement("button")
submitButton.className = "flip-word-extension-button"
submitButton.innerText = "Submit"
submitButton.addEventListener('click', submitWord, false);
containerSubmitButton.appendChild(submitButton);

const closeButton = document.createElement("button")
closeButton.innerText = "Close"
closeButton.addEventListener('click', closePopup, false);

const divContainer = document.createElement("div")
divContainer.id = "flip-word-hover-popup-container"
divContainer.appendChild(containerNativeWord)
divContainer.appendChild(containerForeignWord)
divContainer.appendChild(containerSubmitButton)
divContainer.onclick = (event) => {event.stopPropagation()}
const rects=window.getSelection().getRangeAt(0).getBoundingClientRect()
const relative=document.body.parentNode.getBoundingClientRect()
divContainer.style.top = `${rects.bottom - relative.top}px`
divContainer.style.left = `${rects.right}px`
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

window.onclick = function () {
    closePopup()
}