function initApp() {
  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}


/**
 * Starts the sign-in process.
 */
async function startSignIn() {
  document.getElementById('quickstart-button').disabled = true;
  chrome.extension.getBackgroundPage().signInWithPopup();
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.object == 'signIn' && request.user){
        window.location = 'home/home.html';
      }
    }
)

window.onload = function() {
  initApp();
};
