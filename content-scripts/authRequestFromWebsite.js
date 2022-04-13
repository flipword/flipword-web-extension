document.addEventListener('flipwordAuthRequest', function(e){
    chrome.runtime.sendMessage({
        object: 'flipwordAuthRequest',
        authMethod: e.detail?.authMethod,
        nativeLanguage: e.detail?.nativeLanguage,
        foreignLanguage: e.detail?.foreignLanguage
    })
}, false);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.object == 'loginSuccessful'){
            const event = new CustomEvent("loginSuccessful");
            document.dispatchEvent(event);
        }
    });
