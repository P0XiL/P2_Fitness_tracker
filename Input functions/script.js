// Function to handle addition
function handleAddition() {
    let numberInput = document.getElementById("numberInput");
    let result = document.getElementById("result");

    let inputValue = parseFloat(numberInput.value);
    if (!isNaN(inputValue)) {
        result.textContent = parseFloat(result.textContent) + inputValue;
    } else {
        alert("Please enter a valid number!");
    }
}

// Function to handle subtraction
function handleSubtraction() {
    let numberInput = document.getElementById("numberInput");
    let result = document.getElementById("result");

    let inputValue = parseFloat(numberInput.value);
    if (!isNaN(inputValue)) {
        result.textContent = parseFloat(result.textContent) - inputValue;
    } else {
        alert("Please enter a valid number!");
    }
}

// Add event listeners to input buttons
document.getElementById("addButton").addEventListener("click", handleAddition);
document.getElementById("subtractButton").addEventListener("click", handleSubtraction);
