// LOCALHOST: http://127.0.0.1:3360/
// SERVER: https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node0/
const serverPath = 'https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/';

const tierImages = {
    '1-15': 'image/bronzeTier.png',
    '16-30': 'image/silverTier.png',
    '31-45': 'image/goldTier.png',
};

const tierNames = {
    '1-3': 'Bronze 5',
    '4-6': 'Bronze 4',
    '7-9': 'Bronze 3',
    '10-12': 'Bronze 2',
    '13-15': 'Bronze 1',
    '16-18': 'Silver 5',
    '19-21': 'Silver 4',
    '22-24': 'Silver 3',
    '25-27': 'Silver 2',
    '28-30': 'Silver 1',
    '31-33': 'Gold 5',
    '34-36': 'Gold 4',
    '37-39': 'Gold 3',
    '40-42': 'Gold 2',
    '43-45': 'Gold 1',
};

async function setupTiersForQuestPage(username) {
    try {
        const userData = await fetchUserData(username);

        // Log the JSON object fetched to the console
        //console.log('Fetched JSON data:', userData);

        // Check if the user object exists
        if (userData) {
            // Display user tiers if the user object contains the necessary information
            if (userData.mastery && userData.tier) {
                displayUserTiers(userData, 'dailyQuestTier', 'weeklyQuestTier', 'monthlyQuestTier');
                return userData; // Return the user info
            } else {
                console.error('Mastery or tier information not found in user data');
            }
        } else {
            console.error('User data not found');
        }
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error; // Re-throw the error for handling by the caller
    }
}

async function fetchUserData(username) {
    try {
        // Fetch the JSON data
        const response = await fetch(serverPath + 'json/users_info.json');

        if (!response.ok) {
            throw new Error(`Failed to fetch userinfo.json: ${response.statusText}`);
        }

        // Parse response body as JSON
        const data = await response.json();

        // Find the user data by username
        const userData = data.users_info[username];

        if (!userData) {
            throw new Error(`User data for ${username} not found.`);
        }

        // Return the user data
        return userData;
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error; // Rethrow the error to propagate it to the caller
    }
}

function displayUserTiers(userInfo, DailyID, WeeklyID, MonthlyID) {
    // Check if userInfo is not null or undefined
    if (userInfo) {
        // Get references to tier elements using the provided IDs
        const dailyTierContainer = document.getElementById(DailyID);
        const weeklyTierContainer = document.getElementById(WeeklyID);
        const monthlyTierContainer = document.getElementById(MonthlyID);

        // Check if the tier objects exist in userInfo
        if (userInfo.tier && userInfo.tier.daily && userInfo.tier.weekly && userInfo.tier.monthly) {
            // Determine the tier range and corresponding image for each tier
            const dailyTierRange = getTierRange(userInfo.tier.daily.rank);
            const weeklyTierRange = getTierRange(userInfo.tier.weekly.rank);
            const monthlyTierRange = getTierRange(userInfo.tier.monthly.rank);

            const dailyImageSrc = tierImages[dailyTierRange];
            const weeklyImageSrc = tierImages[weeklyTierRange];
            const monthlyImageSrc = tierImages[monthlyTierRange];

            // Clear existing content
            dailyTierContainer.innerHTML = '';
            weeklyTierContainer.innerHTML = '';
            monthlyTierContainer.innerHTML = '';

            // Create grid items for daily, weekly, and monthly tiers using createRankItem function
            createRankItem(dailyTierContainer, tierNames[getSubTierRange(userInfo.tier.daily.rank)], dailyImageSrc, userInfo.tier.daily.elo, 'Daily', false);
            createRankItem(weeklyTierContainer, tierNames[getSubTierRange(userInfo.tier.weekly.rank)], weeklyImageSrc, userInfo.tier.weekly.elo, 'Weekly', false);
            createRankItem(monthlyTierContainer, tierNames[getSubTierRange(userInfo.tier.monthly.rank)], monthlyImageSrc, userInfo.tier.monthly.elo, 'Monthly', false);
        } else {
            console.error(`'tier' property or its daily, weekly, or monthly sub-properties not found in userInfo`);
        }
    } else {
        console.error('User info is null or undefined');
    }
}

// Function to get the tier range
function getTierRange(rank) {
    switch (true) {
        case rank >= 1 && rank <= 15:
            return '1-15';
        case rank >= 16 && rank <= 30:
            return '16-30';
        case rank >= 31 && rank <= 45:
            return '31-45';
        default:
            // Handle cases outside the defined ranges
            return 'Unknown';
    }
}

// Function to get the sub-tier range
function getSubTierRange(rank) {
    switch (true) {
        case rank >= 1 && rank <= 3:
            return '1-3';
        case rank >= 4 && rank <= 6:
            return '4-6';
        case rank >= 7 && rank <= 9:
            return '7-9';
        case rank >= 10 && rank <= 12:
            return '10-12';
        case rank >= 13 && rank <= 15:
            return '13-15';
        case rank >= 16 && rank <= 18:
            return '16-18';
        case rank >= 19 && rank <= 21:
            return '19-21';
        case rank >= 22 && rank <= 24:
            return '22-24';
        case rank >= 25 && rank <= 27:
            return '25-27';
        case rank >= 28 && rank <= 30:
            return '28-30';
        case rank >= 31 && rank <= 33:
            return '31-33';
        case rank >= 34 && rank <= 36:
            return '34-36';
        case rank >= 37 && rank <= 39:
            return '37-39';
        case rank >= 40 && rank <= 42:
            return '40-42';
        case rank >= 43 && rank <= 45:
            return '43-45';
        default:
            return 'Unknown';
    }
}

function createRankItem(container, title, imageSrc, elo, period, isMastery) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add(isMastery ? 'mastery-grid-item' : 'tier-grid-item');

    // Create and append title
    const itemTitle = document.createElement('h3');
    itemTitle.textContent = isMastery ? `${capitalizeFirstLetter(title)}: ` : `${period}: ${title}`;
    itemDiv.appendChild(itemTitle);

    // Create and append image
    const itemImage = document.createElement('img');
    itemImage.src = imageSrc || 'default_image_path.png'; // Provide a default image path if imageSrc is not provided
    itemImage.alt = isMastery ? `${capitalizeFirstLetter(title)} Tier Image` : `${title} Tier Image`;
    itemDiv.appendChild(itemImage);

    // Create and append progress bar
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');

    const maxElo = isMastery ? 500 : getMaxElo(period); // Get the maximum Elo for the period if it's not a mastery

    const eloProgress = document.createElement('div');
    eloProgress.classList.add('elo-progress');

    // Scale Elo progress
    const eloOutOfMax = Math.min(maxElo, elo); // Ensure elo does not exceed the maximum
    const eloPercentage = (eloOutOfMax / maxElo) * 100; // Calculate Elo percentage
    eloProgress.style.width = `${eloPercentage}%`; // Set width based on Elo percentage

    progressBar.appendChild(eloProgress);
    itemDiv.appendChild(progressBar);

    // Append item to container
    container.appendChild(itemDiv);
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to get maximum Elo based on period
function getMaxElo(period) {
    switch (period) {
        case 'Daily':
            return 100;
        case 'Weekly':
            return 40;
        case 'Monthly':
            return 20;
        default:
            return 100; // Default to daily if period is unknown
    }
}

async function setupProfilePage(username) {
    try {
        // Fetch user data using fetchUserData
        const userData = await fetchUserData(username);

        // Log the fetched JSON data to the console
        //console.log('Fetched JSON data:', userData);

        // Process the JSON data here
        displayProfile(userData, username);



        // Return the user info
        return userData;
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error; // Re-throw the error for handling by the caller
    }
}

function displayProfile(data, username) {
    // Check if the data is not null or undefined
    if (data !== null && data !== undefined) {
        // Extract user information
        const userInfo = data;

        // Check if userInfo contains 'tier' property before calling displayUserTiers
        if (userInfo.tier) {
            displayUserTiers(userInfo, 'dailyTier', 'weeklyTier', 'monthlyTier');
        } else {
            console.error(`'tier' property not found in ${username}'s information`);
        }

        // Check if userInfo contains 'mastery' property before calling displayUserMasteries
        if (userInfo.mastery) {
            displayUserMasteries(userInfo.mastery);
        } else {
            console.error(`'mastery' property not found in ${username}'s information`);
        }

        // Display the user information
        displayUserInfo(username, userInfo);

        // Check if userInfo contains 'preset' property before calling displayUserPreferences
        if (userInfo.preset) {
            displayUserPreferences(username, userInfo);
        } else {
            console.error(`'preset' property not found in ${username}'s information`);
        }
    } else {
        console.error('User data is null or undefined');
    }
}

function displayUserMasteries(masteryInfo) {
    const userMasteriesDiv = document.getElementById('userMasteries');
    userMasteriesDiv.classList.add('mastery-grid-container');

    // Clear existing content inside userMasteriesDiv
    userMasteriesDiv.innerHTML = '';

    // Convert the masteryInfo object to an array of key-value pairs
    const sortedMasteries = Object.entries(masteryInfo).sort((a, b) => b[1].rank - a[1].rank);

    // Array to store all created mastery divs
    const masteryDivs = [];

    // Iterate over the top 3 masteries
    sortedMasteries.slice(0, 3).forEach(([masteryKey, mastery]) => {
        // Create a mastery div for each mastery
        createRankItem(userMasteriesDiv, masteryKey, tierImages[getTierRange(mastery.rank)], mastery.elo, '', true);
        const masteryDiv = userMasteriesDiv.lastChild; // Get the last child, which is the created mastery div
        masteryDivs.push(masteryDiv);
    });

    // Create button to reveal hidden masteries
    let revealButton = document.getElementById('revealButton');

    // If revealButton doesn't exist, create it
    if (!revealButton) {
        revealButton = document.createElement('button');
        revealButton.id = 'revealButton';
        revealButton.textContent = 'Show More Masteries';
        userMasteriesDiv.insertAdjacentElement('afterend', revealButton); // Append after userMasteriesDiv

        // Add event listener only once
        revealButton.addEventListener('click', () => {
            // Append the rest of the masteries
            sortedMasteries.slice(3).forEach(([masteryKey, mastery]) => {
                createRankItem(userMasteriesDiv, masteryKey, tierImages[getTierRange(mastery.rank)], mastery.elo, '', true);
                const masteryDiv = userMasteriesDiv.lastChild; // Get the last child, which is the created mastery div
                masteryDivs.push(masteryDiv);
            });
            // Show the hide button
            hideButton.style.display = 'inline-block';
            // Hide the reveal button
            revealButton.style.display = 'none';
        });
    }

    // Create button to hide extra masteries
    const hideButton = document.createElement('button');
    hideButton.textContent = 'Hide Extra Masteries';
    hideButton.style.display = 'none'; // Initially hidden
    userMasteriesDiv.insertAdjacentElement('afterend', hideButton); // Append after userMasteriesDiv
    hideButton.addEventListener('click', () => {
        // Remove extra masteries
        masteryDivs.slice(3).forEach(div => {
            div.remove();
        });
        // Show the reveal button
        revealButton.style.display = 'inline-block';
        // Hide the hide button
        hideButton.style.display = 'none';
    });
}

function displayUserInfo(username, userInfo) {
    const userInfoDiv = document.getElementById('userInfo');
    let userInfoHTML = `
    <h2 style="text-align: center;">User info</h2>
    <form id="userInfoForm">
        <p>Height: <input type="number" id="height" value="${userInfo.health.height}" required> cm</p>
        <p>Weight: <input type="number" id="weight" value="${userInfo.health.weight}" required> kg</p>
        <button type="submit">Save User Info</button>
    </form>
    <p><span id="bmiText" style="font-size: 14px; margin-top: 5px;"></span></p>
    <canvas id="bmiGraph" width="600" height="400"></canvas>
    `;
    userInfoDiv.innerHTML = userInfoHTML;

    document.getElementById('userInfoForm').addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission
        await postUserInfo(username);
    });

    // Calculate and display initial BMI if height and weight are present
    const height = parseFloat(userInfo.health.height);
    const weight = parseFloat(userInfo.health.weight);
    if (!isNaN(height) && !isNaN(weight)) {
        updateBMI(height, weight);
    }
}

async function postUserInfo(username) {
    validateIntegerInput(parseInt(document.getElementById('height').value))
    const height = parseInt(document.getElementById('height').value);


    validateIntegerInput(parseInt(document.getElementById('weight').value))
    const weight = parseInt(document.getElementById('weight').value);


    try {
        const userData = await fetchUserData(username); // Assuming fetchUserData is a function to fetch user data

        if (userData && userData.username === username) {
            const existingUserInfo = userData;

            // Create a new user info object with the updated health information
            const newUserInfo = {
                username: username,
                health: {
                    name: existingUserInfo.health.name,
                    age: existingUserInfo.health.age,
                    height: height,
                    weight: weight,
                    gender: existingUserInfo.health.gender,
                    fitnessGoal: existingUserInfo.health.fitnessGoal,
                    activityLevel: existingUserInfo.health.activityLevel
                },
                mastery: existingUserInfo.mastery,
                hiddenRank: existingUserInfo.hiddenRank,
                tier: existingUserInfo.tier,
                preset: existingUserInfo.preset
            };

            // Update the user info on the server
            update_users_info(newUserInfo);

            // Calculate and display BMI
            const bmi = calculateBMI(height, weight);
            document.getElementById('bmiText').textContent = `BMI: ${bmi}`;
        } else {
            console.error('User info not found for username:', username);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

function validateIntegerInput(value) {
    // Check if the value is a valid number and an integer
    if (!isNaN(value) && Number.isInteger(value)) {
        // Check if the value is greater than or equal to 0
        if (value >= 0) {
            // Input is valid
            return true;
        } else {
            // Input is negative
            return false;
        }
    } else {
        // Input is not a valid integer
        return false;
    }
}

// Function to update BMI text
function updateBMI(height, weight) {
    const bmi = calculateBMI(height, weight);
    const bmiText = document.getElementById('bmiText');
    bmiText.textContent = `BMI: ${bmi}`;

    // Display warning if BMI is over 25 or under 18.5
    if (bmi > 30) {
        bmiText.innerHTML += `<br><span style="color: #e74c3c;">BMI is over 30 leading to a lot higher possibility of diseases 
        such as cardiovascular diseases. Try to limit calorie intake. This can be done by drinking more water, 
        eating less fatty foods, using smaller plates among many other ways of reducing body weight. 
        We recommend using the "lose weight" preset which you can choose at the bottom of the page.
        For more information on how to 
        lose weight, visit <a href="https://www.health.harvard.edu/topics/diet-and-weight-loss" target="_blank">
        Harvard Health Publishing</a>.</span>`;
    } else if (bmi > 25) {
        bmiText.innerHTML += `<br><span style="color: #f1c40f;">BMI is over 25 leading to a slightly higher possibility of diseases
        such as cardiovascular diseases. Try to limit calorie intake. This can be done by drinking more water, 
        eating less fatty foods, using smaller plates among many other ways of reducing body weight.
        We recommend using the "lose weight" preset which you can choose at the bottom of the page.
        For more information on how to 
        lose weight, visit <a href="https://www.health.harvard.edu/topics/diet-and-weight-loss" target="_blank">
        Harvard Health Publishing</a>.</span>`;
    } else if (bmi > 20) {
        bmiText.innerHTML += `<br><span style="color: #2ecc71;">Great job! You're in the range of a healthy bodyweight for your height.
        Keep going :). 
        We recommend using the "Strength" or "Balance" preset which you can choose at the bottom of the page.</span>`;
    }
     else if (bmi < 18.5) {
        bmiText.innerHTML += `<br><span style="color: #3498db;">BMI is under 18.5. Try to ingest more calories. 
        This can be done by adding in small extra meals around 300-500 calories, drinking high-calorie drinks such as milkshakes,
        adding more protein to your diet among other things. 
        We recommend using the "Strength" preset which you can choose at the bottom of the page.
        For more information on how to 
        gain weight, visit <a href="https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/healthy-ways-to-gain-weight/" target="_blank">
        The National Health Service</a>.</span>`;
    } else {
        // Clear any previous warnings
        bmiText.innerHTML = `BMI: ${bmi}`;
}
drawBMIGraph(bmi);

}

// Calculate BMI function
function calculateBMI(height, weight) {
    // Check for non-numeric inputs
    if (isNaN(height) || isNaN(weight)) {
        return NaN;
    }

    // Check for zero height
    if (height === 0) {
        return Infinity;
    }

    // Check for zero weight or negative height/weight
    if (height <= 0 || weight <= 0) {
        return NaN;
    }

    // Convert height to meters
    const heightMeters = height / 100;

    // Calculate BMI
    const bmi = weight / (heightMeters * heightMeters);

    return bmi.toFixed(1); // Round to 1 decimal place
}

// Function to draw the graph
function drawBMIGraph(bmiValue) {
    // Define BMI categories and their ranges
    var categories = [
        { label: "Underweight", min: 0, max: 18.5, color: "#3498db" },
        { label: "Normal", min: 18.5, max: 24.9, color: "#2ecc71" },
        { label: "Overweight", min: 25, max: 29.9, color: "#f1c40f" },
        { label: "Obese", min: 30, max: 100, color: "#e74c3c" } // Adjusted max value
    ];

    var canvas = document.getElementById("bmiGraph");
    var ctx = canvas.getContext("2d");
    var padding = 10;
    var scaleFactor = 0.5; // Scale factor for resizing the canvas

    // Adjust canvas size
    canvas.width = canvas.width * scaleFactor;
    canvas.height = canvas.height * scaleFactor;

    var barWidth = (canvas.width - 2 * padding) / categories.length;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bars for each category
    categories.forEach(function (category, index) {
        var barHeight = (canvas.height - padding * 2);
        var y = padding;

        // Calculate x position of the bar
        var x = padding + index * barWidth;

        // Draw filled rectangle for the bar
        ctx.fillStyle = category.color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Set text color to white
        ctx.fillStyle = "white";

        // Draw category label in white
        ctx.font = "12px Arial";
        ctx.textAlign = "center"; // Center the text
        ctx.fillText(category.label, x + barWidth / 2, canvas.height - 5);

        // Check if the user's BMI value falls within this category
        if (bmiValue >= category.min && bmiValue <= category.max) {
            // Calculate the position of the red dot within this category
            var progress = (bmiValue - category.min) / (category.max - category.min);
            var dotX = x + progress * barWidth;

            // Draw red dot indicating the user's BMI value
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(dotX, canvas.height / 2, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

async function displayUserPreferences(username, userInfo) {
    const preset = userInfo.preset.name;
    const confObject = userInfo.preset.conf || {}; // Ensure confObject is an object


    // Generate sliders for exercise preferences
    const userInfoDiv = document.getElementById('userPreferences');
    let slidersHTML = '';

    // Iterate through each key in confObject and generate sliders dynamically
    Object.keys(confObject).forEach(exercise => {
        slidersHTML += `
            <div>
                <label for="${exercise}">${exercise}</label>
                <input type="range" id="${exercise}" name="${exercise}" min="0" max="10" value="${confObject[exercise]}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('${exercise}', this.value)">
                <span id="${exercise}Counter">${confObject[exercise]}</span>
            </div>
        `;
    });

    // Adjusted dropdown menu options
    const presetDropdownmenu = `
        <option value="strength" ${preset === 'strength' ? 'selected' : ''}>Strength</option>
        <option value="lose weight" ${preset === 'lose weight' ? 'selected' : ''}>Lose Weight</option>
        <option value="balance" ${preset === 'balance' ? 'selected' : ''}>Balance</option>
        <option value="custom" ${preset === 'custom' ? 'selected' : ''}>Custom</option>
    `;

    const userInfoHTML = `
        <h2 style="text-align: center;">Preferences</h2>
        <label for="presetDropdown">Choose a preset:</label>
        <select id="presetDropdown" onchange="updatePreset('${username}', this.value)"> <!-- Pass 'username' as parameter -->
            ${presetDropdownmenu}
        </select>
        <p>Exercise preferences:</p>
        ${slidersHTML}
        ${preset === 'custom' ? '<button onclick="postCustomData(\'' + username + '\')">Save Preset</button>' : ''}
    `;
    userInfoDiv.innerHTML = userInfoHTML;

    // Update counter values for custom preset
    if (preset === 'custom') {
        Object.keys(confObject).forEach(exercise => {
            updateCounter(exercise, confObject[exercise]);
        });
    }
}

async function updatePreset(username, preset) {
    try {
        const userData = await fetchUserData(username);

        if (userData && userData.username === username) {
            const existingUserInfo = userData;

            let conf = [];
            switch (preset) {
                case 'lose weight':
                    conf = {
                        cardio: 7,
                        lowerbody: 1,
                        core: 1,
                        upperbody: 1
                    }
                    break;
                case 'strength':
                    conf = {
                        cardio: 1,
                        lowerbody: 3,
                        core: 3,
                        upperbody: 3
                    }
                    break;
                case 'balance':
                    conf = {
                        cardio: 2,
                        lowerbody: 2,
                        core: 2,
                        upperbody: 2
                    }
                    break;
                case 'custom':
                    conf = {
                        cardio: 2,
                        lowerbody: 2,
                        core: 2,
                        upperbody: 2
                    }
                    break;
                default:
                    console.error(`Invalid preset: ${preset}`);
                    return;
            }

            // Update only the preset while retaining other information
            const newUserInfo = {
                username: existingUserInfo.username,
                health: existingUserInfo.health,
                mastery: existingUserInfo.mastery,
                hiddenRank: existingUserInfo.hiddenRank,
                tier: existingUserInfo.tier,
                preset: {
                    name: preset,
                    conf: conf
                }
            };

            // Update the user info on the server
            update_users_info(newUserInfo);
            return newUserInfo;
        } else {
            console.error('User info not found for username:', username);
            return null; // Return null to indicate that user info is not available
        }
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return null; // Return null to indicate error in fetching user data
    }
}


// Function to update user info
function update_users_info(newUserInfo) {
    if (newUserInfo != null){
    //console.log("new user info:");
    //console.log(newUserInfo);
    fetch(serverPath + 'write_user_info_json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserInfo, null, 2) // Include the entire user information
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch POST');
            }
            //console.log(response);
            return response.json(); // Read response JSON
        })
        .then(responseJson => {
            //console.log('Response from POST:', responseJson);
            if (responseJson.success) {
                console.log('User info updated successfully');
                // Fetch user data again after successful update
                setupProfilePage(newUserInfo.username);
                return;
            } else {
                console.error('User info update failed:', responseJson.message);
            }
        })
        .catch(error => {
            console.error('Error fetching POST users_info:', error);
        });
    }
    else{
        console.error('newUserInfo is null', error);
    }
}

async function postCustomData(username) {
    try {
        const userData = await fetchUserData(username);

        if (userData && userData.username === username) {
            const existingUserInfo = userData;

            // Get all sliders dynamically generated by displayUserPreferences
            const sliders = document.querySelectorAll('input[type="range"]');
            const conf = {};

            // Iterate through sliders and extract values for each exercise
            sliders.forEach(slider => {
                const exercise = slider.id;
                const value = parseInt(slider.value);
                conf[exercise] = value;
            });

            const newUserInfo = {
                username: username,
                health: existingUserInfo.health,
                mastery: existingUserInfo.mastery,
                hiddenRank: existingUserInfo.hiddenRank,
                tier: existingUserInfo.tier,
                preset: {
                    name: 'custom',
                    conf: conf
                }
            };

            // Call function to update user info
            update_users_info(newUserInfo);
        } else {
            console.error('User info not found for username:', username);
        }
    } catch (error) {
        console.error('Error fetching user data:', error.message);
    }
}




function updateCounter(exercise, value) {
    document.getElementById(`${exercise}Counter`).textContent = value;
}

// Update BMI text after user inputs height or weight
document.getElementById('height').addEventListener('input', function () {
    const height = parseFloat(this.value);
    const weight = parseFloat(document.getElementById('weight').value);
    if (!isNaN(height) && !isNaN(weight)) {
        updateBMI(height, weight);
    }
});

document.getElementById('weight').addEventListener('input', function () {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(this.value);
    if (!isNaN(height) && !isNaN(weight)) {
        updateBMI(height, weight);
    }
});