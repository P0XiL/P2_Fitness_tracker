function showQuestMenu(questId) {
    const questPageContainer = document.getElementById('questPageContainer');

    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Position the overlay to cover the entire viewport
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 1)'; // White with full opacity

    // Append the overlay to the quest page container
    questPageContainer.appendChild(overlay);

    // Call the function to show the quest menu
    // (you can place your existing code for showing the quest menu here)

    // Optionally, remove the overlay after a delay (e.g., 2 seconds)
    setTimeout(function() {
        overlay.remove();
    }, 2000);
}
