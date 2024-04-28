// The function which enables tab switching
document.addEventListener('DOMContentLoaded', function () {
    // Assigns all tabs to an array called links
    const links = document.querySelectorAll('nav a');
    // Get all navigation links
    const navLinks = document.querySelectorAll('#side-nav a');

    // Add click event listener to all buttons for tabs
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            // Disables the hyperref linking from the tab itself since we aren't redirecting, but instead showing and hiding specific pages
            e.preventDefault();

            // Remove 'active' class from all tabs
            document.querySelectorAll('.page').forEach(function (page) {
                page.classList.remove('active');
            });

            // Get the id for the tab which has been clicked
            const targetId = this.getAttribute('href').substring(1);

            // Add 'active' class to tab which has been clicked
            document.getElementById(targetId).classList.add('active');

            // Fetch and display user information on the profile page
            if (targetId === 'profilepage') {
                setupProfilePage('idkey1');
            } else if (targetId === 'main') { // Check if the clicked tab is the quest page
                setupTiersForQuestPage('idkey1'); // Call setupTiersForQuestPage with the appropriate username
            }

            highlightNavLink(targetId);
        });
    });

    // Add other event listeners and functions here...
});

// Function to display login error message
function displayLoginErrorMessage(message) {
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    loginErrorMessage.textContent = message;
    loginErrorMessage.style.color = 'red';
}

// Function to clear login error message
function clearLoginErrorMessage() {
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    loginErrorMessage.textContent = '';
}

async function setupProfilePage(username) {
    try {
        // Fetch the JSON data
        const response = await fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node0/json/users_info.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch userinfo.json: ${response.statusText}`);
        }
        const data = await response.json(); // Parse response body as JSON

        // Log the JSON object fetched to the console
        console.log('Fetched JSON data:', data);

        // Process the JSON data here
        processData(data, username);

        return data.users_info[username]; // Return the user info
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error; // Re-throw the error for handling by the caller
    }
}

async function setupTiersForQuestPage(username) {
    console.log('hej');
    try {
        // Fetch the JSON data
        const response = await fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node0/json/users_info.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch userinfo.json: ${response.statusText}`);
        }
        const data = await response.json(); // Parse response body as JSON

        // Log the JSON object fetched to the console
        console.log('Fetched JSON data:', data);
        displayUserTiers(data.users_info[username],'dailyQuestTier','weeklyQuestTier','monthlyQuestTier');
        

        return data.users_info[username]; // Return the user info
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error; // Re-throw the error for handling by the caller
    }
}

function processData(data, username) {
    // Check if users_info exists in data
    if (data.users_info) {
        // Check if the specified username exists
        if (username && data.users_info[username]) {
            // Extract user information
            const userInfo = data.users_info[username];

            displayUserTiers(userInfo, 'dailyTier', 'weeklyTier', 'monthlyTier');


            // Display the user information
            displayUserInfo(username, userInfo);
            
            // Check if userInfo contains 'preset' property before calling displayUserPreferences
            if (userInfo.preset) {
                displayUserPreferences(username, userInfo);
            } else {
                console.error(`'preset' property not found in ${username}'s information`);
            }

            if (userInfo.mastery) {
                displayUserMasteries(userInfo.mastery);
            } else {
                console.error(`'mastery' property not found in ${username}'s information`);
            }
        } else {
            console.error(`${username} not found in JSON data`);
        }
    } else {
        console.error('users_info not found in JSON data');
    }
}

function displayUserInfo(username, userInfo) {
    const userInfoDiv = document.getElementById('userInfo');
    let userInfoHTML = `
        <h2 style="text-align: center;">User info</h2>
        <p>Height: <input type="number" id="height" value="${userInfo.health.height}" > cm</p>
        <p>Weight: <input type="text" id="weight" value="${userInfo.health.weight}" > kg</p>
        <button onclick="postUserInfo('${username}')">Save User Info</button>
        <p><span id="bmiText" style="font-size: 14px; margin-top: 5px;"></span></p>
    `;
    userInfoDiv.innerHTML = userInfoHTML;

    // Calculate and display initial BMI if height and weight are present
    const height = parseFloat(userInfo.health.height);
    const weight = parseFloat(userInfo.health.weight);
    if (!isNaN(height) && !isNaN(weight)) {
        updateBMI(height, weight);
    }
}

const tierImages = {
    '1-15': 'image/bronzeTier.png',
    '16-30': 'image/silverTier.png',
    '31-45': 'image/goldTier.png',
    // Add more mappings as needed
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

function displayUserTiers(userInfo, DailyID, WeeklyID, MonthlyID) {
    // Map tier ranges to corresponding tier names
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

    // Get references to tier elements using the provided IDs
    const dailyTierContainer = document.getElementById(DailyID);
    const weeklyTierContainer = document.getElementById(WeeklyID);
    const monthlyTierContainer = document.getElementById(MonthlyID);

    // Create a function to generate tier grid items
    function createTierGridItem(container, title, imageSrc, elo, period) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('tier-grid-item');

        // Create and append tier title
        const tierTitle = document.createElement('h3');
        tierTitle.textContent = `${period}: ${title}`;
        gridItem.appendChild(tierTitle);

        // Create and append tier image
        const tierImage = document.createElement('img');
        tierImage.src = imageSrc;
        tierImage.alt = `${title} Tier Image`;
        gridItem.appendChild(tierImage);

        // Create and append progress bar
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');

        const eloProgress = document.createElement('div');
        eloProgress.classList.add('elo-progress');
        eloProgress.style.width = `${elo}%`; // Set width based on elo
        progressBar.appendChild(eloProgress);

        gridItem.appendChild(progressBar);

        // Append grid item to container
        container.appendChild(gridItem);
    }

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

    // Create grid items for daily, weekly, and monthly tiers
    createTierGridItem(dailyTierContainer, tierNames[getSubTierRange(userInfo.tier.daily.rank)], dailyImageSrc, userInfo.tier.daily.elo, 'Daily');
    createTierGridItem(weeklyTierContainer, tierNames[getSubTierRange(userInfo.tier.weekly.rank)], weeklyImageSrc, userInfo.tier.weekly.elo, 'Weekly');
    createTierGridItem(monthlyTierContainer, tierNames[getSubTierRange(userInfo.tier.monthly.rank)], monthlyImageSrc, userInfo.tier.monthly.elo, 'Monthly');
}



function displayUserMasteries(masteryInfo) {
    const userMasteriesDiv = document.getElementById('userMasteries');
    userMasteriesDiv.classList.add('mastery-grid-container');

    // Clear existing content inside userMasteriesDiv
    userMasteriesDiv.innerHTML = '';

    // Sort masteryInfo based on rank in descending order
    const sortedMasteries = Object.entries(masteryInfo).sort((a, b) => b[1].rank - a[1].rank);

    // Array to store all created mastery divs
    const masteryDivs = [];

    // Iterate over the first three sorted masteries
    for (let i = 0; i < Math.min(3, sortedMasteries.length); i++) {
        const [masteryKey, mastery] = sortedMasteries[i];
        const masteryDiv = createMasteryItem(masteryKey, mastery);
        userMasteriesDiv.appendChild(masteryDiv);
        masteryDivs.push(masteryDiv);
    }

    // Create button to reveal hidden masteries
    // Check if the revealButton already exists
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
        for (let i = 3; i < sortedMasteries.length; i++) {
            const [masteryKey, mastery] = sortedMasteries[i];
            const masteryDiv = createMasteryItem(masteryKey, mastery);
            userMasteriesDiv.appendChild(masteryDiv);
            masteryDivs.push(masteryDiv);
        }
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





// Helper function to create mastery item
function createMasteryItem(masteryKey, mastery) {
    const masteryDiv = document.createElement('div');
    masteryDiv.classList.add('mastery-grid-item');

    // Create HTML elements for the mastery
    const masteryHeader = document.createElement('h2');
    masteryHeader.textContent = `${capitalizeFirstLetter(masteryKey)}: `;
    const tierSpan = document.createElement('span');
    tierSpan.id = `${masteryKey}TierInfo`;

    // Determine tier range
    const tierRange = getTierRange(mastery.rank);
    const subTierRange = getSubTierRange(mastery.rank);

    // Check if it's a sub-tier or main tier
    if (subTierRange !== 'Unknown') {
        tierSpan.textContent = `${tierNames[subTierRange]}`;
    } else {
        tierSpan.textContent = `${tierNames[tierRange]}`;
    }

    masteryHeader.appendChild(tierSpan);
    masteryDiv.appendChild(masteryHeader);

    const masteryImage = document.createElement('img');
    masteryImage.id = `${masteryKey}TierImage`;

    // Define image source based on tier range
    const imageSource = tierImages[tierRange];
    masteryImage.src = imageSource || 'default_image_path.png'; // Provide a default image path if tier range is not found in tierImages
    masteryImage.alt = `${capitalizeFirstLetter(masteryKey)} Tier Image`;
    masteryDiv.appendChild(masteryImage);

    // Create progress bar for Elo
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');

    const eloProgress = document.createElement('div');
    eloProgress.classList.add('elo-progress');
    eloProgress.style.width = `${mastery.elo}%`; // Set width based on Elo percentage
    progressBar.appendChild(eloProgress);

    masteryDiv.appendChild(progressBar);

    return masteryDiv;
}










// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to get the tier range
function getTierRange(rank) {
    if (rank >= 1 && rank <= 15) {
        return '1-15';
    } else if (rank >= 16 && rank <= 30) {
        return '16-30';
    } else if (rank >= 31 && rank <= 45) {
        return '31-45';
    }
    // Add more ranges as needed
}

// Function to get the sub-tier range
function getSubTierRange(rank) {
    if (rank >= 1 && rank <= 3) {
        return '1-3';
    } else if (rank >= 4 && rank <= 6) {
        return '4-6';
    } else if (rank >= 7 && rank <= 9) {
        return '7-9';
    } else if (rank >= 10 && rank <= 12) {
        return '10-12';
    } else if (rank >= 13 && rank <= 15) {
        return '13-15';
    } else if (rank >= 16 && rank <= 18) {
        return '16-18';
    } else if (rank >= 19 && rank <= 21) {
        return '19-21';
    } else if (rank >= 22 && rank <= 24) {
        return '22-24';
    } else if (rank >= 25 && rank <= 27) {
        return '25-27';
    } else if (rank >= 28 && rank <= 30) {
        return '28-30';
    } else if (rank >= 31 && rank <= 33) {
        return '31-33';
    } else if (rank >= 34 && rank <= 36) {
        return '34-36';
    } else if (rank >= 37 && rank <= 39) {
        return '37-39';
    } else if (rank >= 40 && rank <= 42) {
        return '40-42';
    } else if (rank >= 43 && rank <= 45) {
        return '43-45';
    } else {
        // Handle cases outside the defined ranges
        return 'Unknown';
    }
}





async function postUserInfo(username) {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    try {
        // Fetch the JSON data
        const response = await fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node0/json/users_info.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch userinfo.json: ${response.statusText}`);
        }
        const data = await response.json(); // Parse response body as JSON

        if (data.users_info && data.users_info[username]) {
            const existingUserInfo = data.users_info[username];

            // Create a new user info object with the updated health information
            const newUserInfo = {
                username: existingUserInfo.username,
                health: {
                    height: height,
                    weight: weight
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
        console.error('Error fetching JSON:', error);
    }
}

function displayUserPreferences(username, userInfo) {
    const preset = userInfo.preset.name;
    const confArray = userInfo.preset.conf || []; // Ensure confArray is an array
    const countMap = {};
    
    // Filter out empty strings or undefined values (if any)
    const filteredArray = confArray.filter(element => element !== '' && element !== undefined);
    
    // Count occurrences of each element in the filtered array
    filteredArray.forEach(element => {
        if (countMap[element]) {
            countMap[element]++;
        } else {
            countMap[element] = 1;
        }
    });

    // Generate sliders for exercise preferences
    const userInfoDiv = document.getElementById('userPreferences');
    let slidersHTML = '';

    // Check if countMap for each exercise is greater than 0, then include the slider
    if (countMap['push-ups'] > 0 || preset=='custom') {
        slidersHTML += `
            <div>
                <label for="pushups">Pushups</label>
                <input type="range" id="pushups" name="pushups" min="1" max="10" value="${countMap['push-ups'] || 1}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('pushups', this.value)">
                <span id="pushupsCounter">${countMap['push-ups'] || 1}</span>
            </div>
        `;
    }
    if (countMap.run > 0 || preset=='custom') {
        slidersHTML += `
            <div>
                <label for="run">Run</label>
                <input type="range" id="run" name="run" min="1" max="10" value="${countMap.run || 1}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('run', this.value)">
                <span id="runCounter">${countMap.run || 1}</span>
            </div>
        `;
    }
    if (countMap.walk > 0 || preset=='custom') {
        slidersHTML += `
            <div>
                <label for="walk">Walk</label>
                <input type="range" id="walk" name="walk" min="1" max="10" value="${countMap.walk || 1}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('walk', this.value)">
                <span id="walkCounter">${countMap.walk || 1}</span>
            </div>
        `;
    }
    if (countMap.crunches >= 0 || preset=='custom') { // Updated condition for crunches
        slidersHTML += `
            <div>
                <label for="crunches">Crunches</label>
                <input type="range" id="crunches" name="crunches" min="1" max="10" value="${countMap.crunches || 0}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('crunches', this.value)">
                <span id="crunchesCounter">${countMap.crunches || 1}</span>
            </div>
        `;
    }
    
    const userInfoHTML = `
        <h2 style="text-align: center;">Preferences</h2>
        <label for="presetDropdown">Choose a preset:</label>
        <select id="presetDropdown" onchange="updatePreset('${username}', this.value)"> <!-- Pass 'username' as parameter -->
            <option value="run" ${preset === 'run' ? 'selected' : ''}>Run</option>
            <option value="walk" ${preset === 'walk' ? 'selected' : ''}>Walk</option>
            <option value="strength" ${preset === 'strength' ? 'selected' : ''}>Strength</option>
            <option value="custom" ${preset === 'custom' ? 'selected' : ''}>Custom</option>
        </select>
        <p>Exercise preferences:</p>
        ${slidersHTML}
        ${preset === 'custom' ? '<button onclick="postCustomData(\'' + username + '\')">Save Preset</button>' : ''}
    `;
    userInfoDiv.innerHTML = userInfoHTML;

    // Update counter values for custom preset
    if (preset === 'custom') {
        updateCounter('pushups', countMap['push-ups'] || 1);
        updateCounter('run', countMap.run || 1);
        updateCounter('walk', countMap.walk || 1);
        updateCounter('crunches', countMap.crunches || 0); // Set crunches count to 0 if not found
    }
}

function updateCounter(exercise, value) {
    document.getElementById(`${exercise}Counter`).textContent = value;
}

function postCustomData(username) {
    const pushupsValue = document.getElementById('pushups').value;
    const runValue = document.getElementById('run').value;
    const walkValue = document.getElementById('walk').value;
    const crunchesValue = document.getElementById('crunches').value; // Define crunchesValue here

    const newUserInfo = {
        username: username,
        preset: {
            name: 'custom',
            conf: [
                ...Array(Number(pushupsValue)).fill('push-ups'),
                ...Array(Number(runValue)).fill('run'),
                ...Array(Number(walkValue)).fill('walk'),
                ...Array(Number(crunchesValue)).fill('crunches')
            ]
        }
    };

    update_users_info(newUserInfo);
}

// Function to generate sliders for exercise preferences
function generateSliders(countMap) {
    return Object.entries(countMap).map(([exercise, count]) => `
        <div>
            <label for="${exercise}">${exercise}</label>
            <input type="range" id="${exercise}" name="${exercise}" min="0" max="10" value="${count}" disabled>
            <span>${count}</span>
        </div>
    `).join('');
}

async function updatePreset(username, preset) {
    try {
        // Fetch the JSON data
        const response = await fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node0/json/users_info.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch userinfo.json: ${response.statusText}`);
        }
        const data = await response.json(); // Parse response body as JSON

        if (data.users_info && data.users_info[username]) {
            const existingUserInfo = data.users_info[username];
            let conf = [];
            let run = 0;
            let walk = 0;
            let crunches = 0;
            let pushUps = 0;

            switch (preset) {
                case 'run':
                    run = 10;
                    walk = 4;
                    crunches = 3;
                    conf = [
                        ...Array(Number(run)).fill('run'),
                        ...Array(Number(walk)).fill('walk'),
                        ...Array(Number(crunches)).fill('crunches')
                    ];
                    break;
                case 'walk':
                    run = 4;
                    walk = 10;
                    crunches = 3;
                    conf = [
                        ...Array(Number(run)).fill('run'),
                        ...Array(Number(walk)).fill('walk'),
                        ...Array(Number(crunches)).fill('crunches')
                    ];
                    break;
                case 'strength':
                    run = 2;
                    walk = 2;
                    crunches = 6;
                    pushUps = 4;
                    conf = [
                        ...Array(Number(run)).fill('run'),
                        ...Array(Number(walk)).fill('walk'),
                        ...Array(Number(crunches)).fill('crunches'),
                        ...Array(Number(pushUps)).fill('push-ups')
                    ];
                    break;
                case 'custom':
                    run = 1;
                    walk = 1;
                    crunches = 1;
                    pushUps = 1;
                    conf = [
                        ...Array(Number(run)).fill('run'),
                        ...Array(Number(walk)).fill('walk'),
                        ...Array(Number(crunches)).fill('crunches'),
                        ...Array(Number(pushUps)).fill('push-ups')
                    ];
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
        } else {
            console.error('User info not found for username:', username);
        }
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

// Function to update user info
function update_users_info(newUserInfo) {
    fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node0/write_user_info_json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserInfo, null, 2) // Use null for replacer and 2 for indentation
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch POST');
            }
            return response.json(); // Read response JSON
        })
        .then(responseJson => {
            console.log('Response from POST:', responseJson);
            if (responseJson.success) {
                console.log('User info updated successfully');
                // Fetch user data again after successful update
                setupProfilePage(newUserInfo.username);
            } else {
                console.error('User info update failed:', responseJson.message);
            }
        })
        .catch(error => {
            console.error('Error fetching POST users_info:', error);
        });
}


// Calculate BMI function
function calculateBMI(height, weight) {
    // Convert height to meters
    const heightMeters = height / 100;
    // Calculate BMI
    const bmi = weight / (heightMeters * heightMeters);
    return bmi.toFixed(1); // Round to 1 decimal place
}

// Function to update BMI text
function updateBMI(height, weight) {
    const bmi = calculateBMI(height, weight);
    const bmiText = document.getElementById('bmiText');
    bmiText.textContent = `BMI: ${bmi}`;
}

// Update BMI text after user inputs height or weight
document.getElementById('height').addEventListener('input', function() {
    const height = parseFloat(this.value);
    const weight = parseFloat(document.getElementById('weight').value);
    if (!isNaN(height) && !isNaN(weight)) {
        updateBMI(height, weight);
    }
});

document.getElementById('weight').addEventListener('input', function() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(this.value);
    if (!isNaN(height) && !isNaN(weight)) {
        updateBMI(height, weight);
    }
});