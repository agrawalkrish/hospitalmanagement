// Main script to load components
document.addEventListener("DOMContentLoaded", function () {
    loadComponent("navbar", "components/navbar.html");
    loadComponent("main-content", "components/dashboard.html");
});

function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        });
}

function navigateTo(page) {
    loadComponent("main-content", `components/${page}.html`);
}
