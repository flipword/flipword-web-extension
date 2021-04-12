function buttonPopup() {
    closeButtonPopup()
    const popupButton = document.createElement("div");
    popupButton.id = "flip-word-popup-button";
    const icon = chrome.extension.getURL("icon.png");
    const rects = window.getSelection().getRangeAt(0).getClientRects();
    const n = rects.length - 1;
    popupButton.style.backgroundImage = `url("${icon}")`
    popupButton.style.top = `${rects[n].top + 10}px`
    popupButton.style.left = `${rects[n].right}px`
    popupButton.onmousedown = (event) => openHoverPopup(event)
    document.body.appendChild(popupButton);
}

function openHoverPopup(event) {
    event.preventDefault()
    event.cancelBubble = true;
    closeButtonPopup()
    chrome.runtime.sendMessage({object: 'displayPopup'});
}

function closeButtonPopup() {
    const popupButton = document.getElementById('flip-word-popup-button')
    if(popupButton){
        popupButton.remove()
    }
}

window.onmouseup = () => {
    if(!window.getSelection().isCollapsed)
        buttonPopup()
    else
        closeButtonPopup()
}