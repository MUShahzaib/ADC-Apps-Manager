function showPopup(message) {
    const popup = document.querySelector('.popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popup.style.display = 'block';
}

function hidePopup() {
    const popup = document.querySelector('.popup');
    popup.style.display = 'none';
}

export {showPopup,hidePopup};