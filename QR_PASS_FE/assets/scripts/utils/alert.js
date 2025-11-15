// Alert function
function alertPopup(message) {
    const alertElement = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");
    const closeButton = document.getElementById("alertCloseButton");

    alertMessage.textContent = message;
    document.body.classList.add("modal-open");
    alertElement.style.display = "flex";

    closeButton.onclick = function() {
        alertElement.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            alertElement.style.display = "none";
            document.body.classList.remove("modal-open");
        }
    });
}

export default alertPopup;