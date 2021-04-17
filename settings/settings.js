let languages = []

function initApp(){
    console.log('Init option');
    chrome.runtime.sendMessage({object: 'getUser'});
    chrome.storage.local.get(['languages'], function(result) {
        languages = result.languages
    })
}

function removeChilds(parent) {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

function updateNativeLanguage(){
    const select = document.getElementById('native-language');
    chrome.runtime.sendMessage({object: 'updateNativeLanguage', languageIsoCode: select.value});
}

function updateForeignLanguage(){
    const select = document.getElementById('foreign-language');
    chrome.runtime.sendMessage({object: 'updateForeignLanguage', languageIsoCode: select.value});
}

function displayUserInfo(user){
    console.log('user: ', user)
     const loginContainer = document.getElementById('quickstart-button-container');
     if(loginContainer){
         loginContainer.remove();
     }
     const container = document.getElementById('user-setting-container');
    removeChilds(container);

     const currentUserSpan = document.createElement('span');
     currentUserSpan.id = 'current-user-email';
     currentUserSpan.innerText = `Current user: ${user.email}`;

     const currentNativeLanguageLabel = document.createElement('label')
     currentNativeLanguageLabel.htmlFor = 'native-language';
     currentNativeLanguageLabel.innerText = 'Native language: '
     const currentNativeLanguage = document.createElement('select');
     currentNativeLanguage.id = 'native-language';
     currentNativeLanguage.name = 'native-language';
     currentNativeLanguage.className = 'language';
     languages.forEach((language) => {
         console.log('language: ', language)
         const option = document.createElement("option");
         option.value = language.isoCode;
         option.innerText = language.label;
         currentNativeLanguage.appendChild(option);
     })
     currentNativeLanguage.onchange = updateNativeLanguage

     const currentForeignLanguageLabel = document.createElement('label')
     currentForeignLanguageLabel.htmlFor = 'foreign-language';
     currentForeignLanguageLabel.innerText = 'Foreign language: '
     const currentForeignLanguage = document.createElement('select');
     currentForeignLanguage.id = 'foreign-language';
     currentForeignLanguage.name = 'foreign-language';
     currentForeignLanguage.className = 'language';
     languages.forEach((language) => {
         const option = document.createElement("option");
         option.value = language.isoCode;
         option.innerText = language.label;
         currentForeignLanguage.appendChild(option);
     })
     currentForeignLanguage.onchange = updateForeignLanguage

     container.appendChild(currentUserSpan);
     container.appendChild(currentNativeLanguageLabel);
     container.appendChild(currentNativeLanguage);
     container.appendChild(currentForeignLanguageLabel);
     container.appendChild(currentForeignLanguage);

     currentForeignLanguage.value = user.foreignLanguageIsoCode;
     currentNativeLanguage.value = user.nativeLanguageIsoCode;
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.object == 'userUpdated' && !!request.user){
            console.log("user data:", request.user)
            displayUserInfo(request.user)
        }
    }
);


window.onload = function() {
    initApp();
};