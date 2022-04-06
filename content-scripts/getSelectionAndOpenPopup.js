function sendDisplayPopupMessage(){
    const selection = window.getSelection().toString();
    chrome.runtime.sendMessage({object: 'displayPopup', selection: selection});
}

if(!!window.getSelection().toString()){
    sendDisplayPopupMessage();
}
