function initApp(){
    console.log('Init option');
    chrome.runtime.sendMessage({object: 'getUser'});
}

function displayUserInfo(user){
     const loginContainer = document.getElementById('quickstart-button-container');
     if(loginContainer){
         loginContainer.remove();
     }
     const container = document.getElementById('user-setting-container');

     const currentUserSpan = document.createElement('span');
     currentUserSpan.id = 'current-user-email';
     currentUserSpan.innerText = `Current user: ${user.email}`;

     const currentNativeLanguage = document.createElement('span');
     currentNativeLanguage.id = 'native-language';
     currentNativeLanguage.className = 'language';
     currentNativeLanguage.innerText = `Native language: ${user.nativeLanguageIsoCode}`;

     const currentForeignLanguage = document.createElement('span');
     currentForeignLanguage.id = 'foreign-language';
     currentForeignLanguage.className = 'language';
     currentForeignLanguage.innerText = `Foreign language: ${user.foreignLanguageIsoCode}`;

     container.appendChild(currentUserSpan);
     container.appendChild(currentNativeLanguage);
     container.appendChild(currentForeignLanguage);
}
console.log("Test settingd")

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