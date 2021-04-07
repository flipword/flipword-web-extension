function initApp() {
  document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
}


/**
 * Starts the sign-in process.
 */
async function startSignIn() {
  document.getElementById('quickstart-button').disabled = true;
  chrome.extension.getBackgroundPage().signInWithPopup();
}

window.onload = function() {
  initApp();
};
