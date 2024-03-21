let goal = 0; // Variable to store the goal

// Function to add 
function handleAddition() {
    let numberInput = document.getElementById("numberInput");
    let result = document.getElementById("result");

    let inputValue = parseFloat(numberInput.value);
    if (!isNaN(inputValue)) {
        let newResult = parseFloat(result.textContent) + inputValue;
        result.textContent = newResult;

        checkGoalReached(newResult);
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
        let newResult = parseFloat(result.textContent) - inputValue;
        result.textContent = newResult;

        checkGoalReached(newResult);
    } else {
        alert("Please enter a valid number!");
    }
}

// Function to set the goal
function setGoal() {
    let goalInput = document.getElementById("goalInput");
    goal = parseFloat(goalInput.value);

    let goalDisplay = document.getElementById("goalDisplay");
    goalDisplay.textContent = goal;
}

// Function to check if the goal is reached
function checkGoalReached(result) {
    if (result >= goal) {
        alert("Congratulations! You've reached your goal!");
    }
}

// Add event listeners to buttons
document.getElementById("addButton").addEventListener("click", handleAddition);
document.getElementById("subtractButton").addEventListener("click", handleSubtraction);
document.getElementById("setGoalButton").addEventListener("click", setGoal);
