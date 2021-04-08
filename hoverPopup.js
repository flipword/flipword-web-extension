var selection = window.getSelection().toString();
console.log("selection:", selection)

var inputNativeWord = document.createElement("input")
var labelInputNativeWord = document.createElement("label")
inputNativeWord.id = "flip-word-input-native-word"
inputNativeWord.className = "flip-word-input-word"
inputNativeWord.name = "flip-word-input-native-word"
inputNativeWord.type = "text"
inputNativeWord.value = selection
labelInputNativeWord.htmlFor = "flip-word-input-native-word"
labelInputNativeWord.innerText = "Native word:"

var inputForeignWord = document.createElement("input")
var labelInputForeignWord = document.createElement("label")
inputForeignWord.id = "flip-word-input-foreign-word"
inputForeignWord.name = "flip-word-input-foreign-word"
inputForeignWord.className = "flip-word-input-word"
inputForeignWord.type = "text"
labelInputForeignWord.htmlFor = "flip-word-input-foreign-word"
labelInputForeignWord.innerText = "Foreign word:"

var submitButton = document.createElement("button")
submitButton.innerText = "Submit"

var divContainer = document.createElement("div")
divContainer.id = "flip-word-hover-popup-container"
divContainer.appendChild(labelInputNativeWord)
divContainer.appendChild(inputNativeWord)
divContainer.appendChild(labelInputForeignWord)
divContainer.appendChild(inputForeignWord)
divContainer.appendChild(submitButton)

document.body.appendChild(divContainer)