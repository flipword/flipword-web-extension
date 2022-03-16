function initApp() {
  document.getElementById('google-button').addEventListener('click', startSignInGoogle, false);
  document.getElementById('apple-button').addEventListener('click', startSignInApple, false);
}


/**
 * Starts the sign-in process.
 */
async function startSignInGoogle() {
  document.getElementById('google-button').disabled = true;
  document.getElementById('apple-button').disabled = true;
  chrome.extension.getBackgroundPage().signInWithGoogle();
}

async function startSignInApple() {
    document.getElementById('google-button').disabled = true;
    document.getElementById('apple-button').disabled = true;
    chrome.extension.getBackgroundPage().signInWithApple();
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.object == 'dataLoaded'){
          console.log("windows location")
        window.location = '../home/home.html';
      }
    }
)

window.onload = function() {
  initApp();
};
