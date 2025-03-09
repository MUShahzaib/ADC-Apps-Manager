const popup = document.createElement('div');
popup.classList.add('popup');
popup.innerHTML = `
    <div class="popup-content">
        <p id="popup-message"></p>
        <div class="loader"></div>
    </div>
`;
document.body.appendChild(popup);

function showPopup(message) {
    const popup = document.querySelector('.popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popup.style.display = 'flex';
}

function hidePopup() {
    const popup = document.querySelector('.popup');
    popup.style.display = 'none';
}