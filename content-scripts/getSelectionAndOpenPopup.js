console.log("I'am getting selection");
const selection = window.getSelection().toString();
chrome.runtime.sendMessage({object: 'displayPopup', selection: selection});