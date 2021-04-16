function buttonPopup() {
    closeButtonPopup()
    const popupButton = document.createElement("div");
    popupButton.id = "flip-word-popup-button";
    const icon = chrome.extension.getURL("icon.png");
    const rects=window.getSelection().getRangeAt(0).getBoundingClientRect();
    const relative=document.body.parentNode.getBoundingClientRect();
    popupButton.style.backgroundImage = `url("${icon}")`
    popupButton.style.top = `${rects.bottom - relative.top}px`
    popupButton.style.left = `${rects.right}px`
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