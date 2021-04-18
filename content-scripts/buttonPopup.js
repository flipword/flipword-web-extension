function buttonPopup() {
    closeButtonPopup()
    const iconSvg = 'data:image/svg+xml,%3Csvg%20width%3D%22500%22%20height%3D%22539%22%20viewBox%3D%220%200%20500%20539%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cmask%20id%3D%22mask0%22%20mask-type%3D%22alpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%2219%22%20width%3D%22500%22%20height%3D%22500%22%3E%0A%3Crect%20y%3D%2219%22%20width%3D%22500%22%20height%3D%22500%22%20fill%3D%22%23FF9100%22%2F%3E%0A%3C%2Fmask%3E%0A%3Cg%20mask%3D%22url(%23mask0)%22%3E%0A%3Crect%20y%3D%2219%22%20width%3D%22500%22%20height%3D%22500%22%20fill%3D%22%23FF9100%22%2F%3E%0A%3Cpath%20d%3D%22M222.901%2040L691.023%20389.497L501.079%20643.912L32.9566%20294.415L222.901%2040Z%22%20fill%3D%22%23FF7900%22%2F%3E%0A%3Crect%20x%3D%22-21.7701%22%20y%3D%22269.747%22%20width%3D%2265.6759%22%20height%3D%22390.097%22%20transform%3D%22rotate(-42.2229%20-21.7701%20269.747)%22%20fill%3D%22%23FF9100%22%2F%3E%0A%3Crect%20width%3D%22271.137%22%20height%3D%22391.29%22%20rx%3D%2220%22%20transform%3D%22matrix(0.738385%20-0.674379%200.674623%200.738162%2020.7591%20215.534)%22%20fill%3D%22white%22%2F%3E%0A%3Crect%20width%3D%22270.462%22%20height%3D%22391.29%22%20rx%3D%2220%22%20transform%3D%22matrix(0.738385%20-0.674379%200.674623%200.738162%2016.3213%20215.45)%22%20fill%3D%22white%22%2F%3E%0A%3Crect%20width%3D%22222.713%22%20height%3D%22346.804%22%20rx%3D%2220%22%20transform%3D%22matrix(0.738385%20-0.674379%200.674623%200.738162%2045.9393%20211.586)%22%20fill%3D%22%23FF7900%22%2F%3E%0A%3Cpath%20d%3D%22M29.284%20229.453C28.1663%20228.23%2028.2519%20226.333%2029.4753%20225.216L224.561%2047.0404C225.785%2045.9231%20227.682%2046.0087%20228.8%2047.2318L350.429%20180.316L150.913%20362.538L29.284%20229.453Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A'
    const popupButton = document.createElement("div");
    popupButton.id = "flip-word-popup-button";
    const rects=window.getSelection().getRangeAt(0).getBoundingClientRect();
    const relative=document.body.parentNode.getBoundingClientRect();
    popupButton.style.backgroundImage = `url("${iconSvg}")`
    popupButton.style.top = `${rects.bottom - relative.top}px`
    popupButton.style.left = `${rects.right}px`
    popupButton.onmousedown = (event) => openHoverPopup(event)
    document.body.appendChild(popupButton);
}

function openHoverPopup(event) {
    const selection = window.getSelection().toString();
    event.preventDefault()
    event.cancelBubble = true;
    closeButtonPopup()
    chrome.runtime.sendMessage({object: 'displayPopup', selection: selection});
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