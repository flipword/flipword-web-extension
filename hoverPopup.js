var divContainer = document.createElement("div")
var inputNativeWord = document.createElement("input")
var labelInputNativeWord = document.createElement("label")
var inputForeignWord = document.createElement("input")
var labelInputForeignWord = document.createElement("label")
var submitButton = document.createElement("button")

inputNativeWord.id = "flip-word-input-native-word"
inputNativeWord.className = "flip-word-input-word"
inputNativeWord.name = "flip-word-input-native-word"
inputNativeWord.type = "text"
labelInputNativeWord.htmlFor = "flip-word-input-native-word"
labelInputNativeWord.innerText = "Native word:"
inputForeignWord.id = "flip-word-input-foreign-word"
inputForeignWord.name = "flip-word-input-foreign-word"
inputForeignWord.className = "flip-word-input-word"
inputForeignWord.type = "text"
labelInputForeignWord.htmlFor = "flip-word-input-foreign-word"
labelInputForeignWord.innerText = "Foreign word:"
submitButton.innerText = "Submit"
divContainer.id = "flip-word-hover-popup-container"
divContainer.appendChild(labelInputNativeWord)
divContainer.appendChild(inputNativeWord)
divContainer.appendChild(labelInputForeignWord)
divContainer.appendChild(inputForeignWord)
divContainer.appendChild(submitButton)
document.body.appendChild(divContainer)