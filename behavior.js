////////// behavior.js \\\\\\\\\\

document.addEventListener("DOMContentLoaded", function() {
    const gameModeButtons = document.querySelectorAll('input[name="game_mode_button"]');
    const pagePath = window.location.pathname;

    // Add event listeners to each game mode button.
    gameModeButtons.forEach(function(changeMode) {
        changeMode.addEventListener("change", function() {
            const selectedMode = this.id;
            
            // Save the selected mode to localStorage.
            localStorage.setItem("selectedMode", selectedMode);
            
            // Redirect to index.html or reload the page.
            if (!window.location.href.includes("index.html")) {
                window.location.href = "index.html";
            } else {
                window.location.reload();
            }
        });
    });

    // Retrieve the selected mode from localStorage.
    let selectedMode = localStorage.getItem("selectedMode");

    // If on "about.html" or "rules.html", uncheck all game mode buttons.
    if (pagePath.includes("about.html") || pagePath.includes("rules.html")) {
        gameModeButtons.forEach(function(changeMode) {
            changeMode.checked = false;
        });
    } else {
        if (!selectedMode) {
            selectedMode = "single_player";
        }
        
        // Set the checked property of the selected game mode button.
        const selectedGameModeButton = document.getElementById(selectedMode);
        if (selectedGameModeButton) {
            selectedGameModeButton.checked = true;
        }
    }
});
