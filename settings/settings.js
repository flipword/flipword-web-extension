let languages = []
let popupButton = true

function initApp(){
    document.getElementById('google-button').addEventListener('click', startSignInGoogle, false);
    document.getElementById('apple-button').addEventListener('click', startSignInApple, false);
    chrome.storage.local.get(['languages'], function(result) {
        languages = result.languages
    })
    chrome.storage.local.get(['popupButtonChecked'], function(result) {
        if(!!JSON.stringify(result.popupButtonChecked)) {
            popupButton = result.popupButtonChecked;
        }
    })
    chrome.runtime.sendMessage({object: 'getUser'});
}

async function startSignInGoogle() {
    document.getElementById('google-button').disabled = true;
    chrome.extension.getBackgroundPage().signInWithGoogle();
}

async function startSignInApple() {
    document.getElementById('google-button').disabled = true;
    chrome.extension.getBackgroundPage().signInWithApple();
}

function changeOptionPopup(checked) {
    const checkboxButtonPopup = document.getElementById('button-popup');
    checkboxButtonPopup.checked = checked;
    chrome.storage.local.set({popupButtonChecked: checked});
}

function updateNativeLanguage(){
    const select = document.getElementById('native-language');
    chrome.runtime.sendMessage({object: 'updateNativeLanguage', languageIsoCode: select.value});
}

function updateForeignLanguage(){
    const select = document.getElementById('foreign-language');
    chrome.runtime.sendMessage({object: 'updateForeignLanguage', languageIsoCode: select.value});
}

function removeChildren(parent) {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

function displayUserInfo(user){
     let container = document.getElementById('user-info-container');
     if(container != null) {
         removeChildren(container)
     } else {
         container = document.createElement('div');
         container.id = 'user-info-container'
     }
     const parent = document.getElementById('user-setting-container');
     const containerButton = document.getElementById('container-button');
     containerButton.hidden = true;

     const currentUserSpan = document.createElement('span');
     currentUserSpan.id = 'current-user-email';
     currentUserSpan.innerText = `Current user: ${user.email}`;

    const checkboxButtonPopup = document.getElementById('button-popup');
    checkboxButtonPopup.checked = popupButton;
    checkboxButtonPopup.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            checkboxButtonPopup.checked = true;
            changeOptionPopup(true);
        } else {
            checkboxButtonPopup.checked = false;
            changeOptionPopup(false);
        }
    })

     const currentNativeLanguageLabel = document.createElement('label')
     currentNativeLanguageLabel.htmlFor = 'native-language';
     currentNativeLanguageLabel.innerText = 'Native language: '
     const currentNativeLanguage = document.createElement('select');
     currentNativeLanguage.id = 'native-language';
     currentNativeLanguage.name = 'native-language';
     currentNativeLanguage.className = 'language';
     languages.forEach((language) => {
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
    const logoutButton = document.createElement('button')
    logoutButton.id = 'logout-button';
    logoutButton.innerText = 'Logout'
    logoutButton.addEventListener('click', logout, false);

     container.appendChild(currentUserSpan);
     container.appendChild(currentNativeLanguageLabel);
     container.appendChild(currentNativeLanguage);
     container.appendChild(currentForeignLanguageLabel);
     container.appendChild(currentForeignLanguage);
     container.appendChild(logoutButton);
     parent.appendChild(container);
     currentForeignLanguage.value = user.foreignLanguageIsoCode;
     currentNativeLanguage.value = user.nativeLanguageIsoCode;
}

function hideUserInfo() {
    const container = document.getElementById('user-info-container');
    const containerButton = document.getElementById('container-button');
    containerButton.hidden = false;
    if(container != null){
        container.remove()
    }

}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.object == 'userUpdated' && !!request.user){
            displayUserInfo(request.user)
        }
        else if (request.object == 'logout'){
            hideUserInfo()
        }
        else if (request.object == 'login'){
            chrome.runtime.sendMessage({object: 'getUser'});
        }
    }
);

function logout() {
    chrome.extension.getBackgroundPage().logout();
}


window.onload = function() {
    initApp();
};
