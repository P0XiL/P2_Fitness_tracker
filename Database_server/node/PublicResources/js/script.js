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
                fetchUserData('idkey1');
            }

            highlightNavLink(targetId);
        });
    });

    document.getElementById('toggleCreatePageLink').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior

        const createAccountPage = document.getElementById('createAccount');
        const loginPage = document.getElementById('loginPage');

        createAccountPage.classList.remove('active');
        loginPage.classList.add('active');
        clearCreateErrorMessage();
        document.querySelector('input[name="create_username"]').value = '';
        document.querySelector('input[name="create_password"]').value = '';
        document.querySelector('input[name="create_confirm_password"]').value = '';
    });

    document.getElementById('toggleLoginPageLink').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior

        const createAccountPage = document.getElementById('createAccount');
        const loginPage = document.getElementById('loginPage');

        loginPage.classList.remove('active');
        createAccountPage.classList.add('active');
        clearLoginErrorMessage();
        document.querySelector('input[name="login_username"]').value = '';
        document.querySelector('input[name="login_password"]').value = '';
    });

    


    // Add event listener to the submit button
    document.getElementById('submitBtn').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default form submission

        // Get username and password values
        const username = document.querySelector('input[name="create_username"]').value;
        const password = document.querySelector('input[name="create_password"]').value;
        const confirmPassword = document.querySelector('input[name="create_confirm_password"]').value;

        if (password !== confirmPassword) {
            displayCreateErrorMessage("Passwords do not match");
        }
        else {
            clearCreateErrorMessage();

            // Create an object with username and password
            const userData = {
                username: username,
                password: password
            };

            // Send the data to the server-side script for file writing
            createUser(userData);
        }
    });

    document.getElementById('loginBtn').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default form submission
    
        // Get username and password values
        const username = document.querySelector('input[name="login_username"]').value;
        const password = document.querySelector('input[name="login_password"]').value;
    
        // Create an object with username and password
        const loginData = {
            username: username,
            password: password
        };
    
        // Send the data to the server-side script for login authentication
        loginUser(loginData);
    });
    
    document.getElementById('toggleStatsPageLink').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior

        const createAccountPage = document.getElementById('userstats');
        const loginPage = document.getElementById('stats');

        loginPage.classList.remove('active');
        createAccountPage.classList.add('active');
    });

    document.getElementById('toggleFriendPlotPageLink').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior

        const createAccountPage = document.getElementById('FriendsPlot');
        const loginPage = document.getElementById('userfriend');

        loginPage.classList.remove('active');
        createAccountPage.classList.add('active');
    });

    document.getElementById('toggleFriendPageLink').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior

        const createAccountPage = document.getElementById('userfriend');
        const loginPage = document.getElementById('friends');

        loginPage.classList.remove('active');
        createAccountPage.classList.add('active');
    });
    
    function loginUser(loginData) {
        fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (response.ok) {
                console.log('User successfully logged in');
                // Reset input fields
                document.querySelector('input[name="login_username"]').value = '';
                document.querySelector('input[name="login_password"]').value = '';
    
                clearLoginErrorMessage();
    
                // Update UI to reflect logged-in status (e.g., display username in the top right)
                // Redirect to home page or perform other actions as needed
            } else {
                response.text().then(errorMessage => {
                    displayLoginErrorMessage(errorMessage);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to send data to server-side script
    function createUser(userData) {
        fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/createUser', { // Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node4/writeUserData, or http://127.0.0.1:3364/writeUserData depending on localhost or server host
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Data successfully sent to server');
                    // Reset input fields
                    document.querySelector('input[name="create_username"]').value = '';
                    document.querySelector('input[name="create_password"]').value = '';
                    document.querySelector('input[name="create_confirm_password"]').value = '';

                    clearCreateErrorMessage();

                    // Redirect to home page
                    document.getElementById('main').classList.add('active');
                    highlightNavLink('main');
                    document.getElementById('loginPage').classList.remove('active');
                } else {
                    response.text().then(errorMessage => {
                        displayCreateErrorMessage(errorMessage);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function displayCreateErrorMessage(message) {
        const errorMessage = document.getElementById('createErrorMessage');
        errorMessage.textContent = message;
        errorMessage.style.color = 'red';
    }

    function clearCreateErrorMessage() {
        const errorMessage = document.getElementById('createErrorMessage');
        errorMessage.textContent = '';
    }


    //Function which highlights the link of the currently selected tab
    function highlightNavLink(pageId) {
        // Remove 'active' class from all navigation links
        const navLinks = document.querySelectorAll('#side-nav a');
        navLinks.forEach(function(link) {
            link.classList.remove('active');
        });
        if (pageId == "loginPage"){
            return;
        }
        // Add 'active' class to the corresponding navigation link
        const activeLink = document.querySelector('#side-nav a[href="#' + pageId + '"]');
        activeLink.classList.add('active');
        }
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

async function fetchUserData(username) {
    try {
        // Fetch the JSON data
        const response = await fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/json/users_info.json');
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

function processData(data, username) {
    // Check if users_info exists in data
    if (data.users_info) {
        // Check if the specified username exists
        if (username && data.users_info[username]) {
            // Extract user information
            const userInfo = data.users_info[username];

            displayUserTiers(userInfo);

            // Display the user information
            displayUserInfo(username, userInfo);
            
            // Check if userInfo contains 'preset' property before calling displayUserPreferences
            if (userInfo.preset) {
                displayUserPreferences(username, userInfo);
            } else {
                console.error(`'preset' property not found in ${username}'s information`);
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

function displayUserTiers(userInfo) {
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

    const dailyTierImage = document.getElementById('dailyTierImage');
    const weeklyTierImage = document.getElementById('weeklyTierImage');
    const monthlyTierImage = document.getElementById('monthlyTierImage');
    const dailyTierInfo = document.getElementById('dailyTierInfo');
    const weeklyTierInfo = document.getElementById('weeklyTierInfo');
    const monthlyTierInfo = document.getElementById('monthlyTierInfo');

    // Map tier ranges to corresponding image URLs
    const tierImages = {
        '1-15': 'image/bronzeTier.png',
        '16-30': 'image/silverTier.png',
        '31-45': 'image/goldTier.png',
        // Add more mappings as needed
    };

    // Determine the tier range based on the user's tier data
    let dailyTierRange = getTierRange(userInfo.tier.daily);
    let weeklyTierRange = getTierRange(userInfo.tier.weekly);
    let monthlyTierRange = getTierRange(userInfo.tier.monthly);

    // Set image URLs based on the determined tier ranges
    dailyTierImage.src = tierImages[dailyTierRange];
    weeklyTierImage.src = tierImages[weeklyTierRange];
    monthlyTierImage.src = tierImages[monthlyTierRange];

    dailyTierRange = getSubTierRange(userInfo.tier.daily);
    weeklyTierRange = getSubTierRange(userInfo.tier.weekly);
    monthlyTierRange = getSubTierRange(userInfo.tier.monthly);

    console.log(userInfo.tier.daily);
    console.log(userInfo.tier.weekly);
    console.log(userInfo.tier.monthly);

    // Set tier names next to the headers
    dailyTierInfo.textContent = tierNames[dailyTierRange];
    weeklyTierInfo.textContent = tierNames[weeklyTierRange];
    monthlyTierInfo.textContent = tierNames[monthlyTierRange];

    // Function to get the tier range
    function getTierRange(tier) {
        if (tier >= 1 && tier <= 15) {
            return '1-15';
        } else if (tier >= 16 && tier <= 30) {
            return '16-30';
        } else if (tier >= 31 && tier <= 45) {
            return '31-45';
        }
        // Add more ranges as needed
    }

    // Function to get the tier range
    // Function to get the sub-tier range
    function getSubTierRange(tier) {
    if (tier >= 1 && tier <= 3) {
        return '1-3';
    } else if (tier >= 4 && tier <= 6) {
        return '4-6';
    } else if (tier >= 7 && tier <= 9) {
        return '7-9';
    } else if (tier >= 10 && tier <= 12) {
        return '10-12';
    } else if (tier >= 13 && tier <= 15) {
        return '13-15';
    } else if (tier >= 16 && tier <= 18) {
        return '16-18';
    } else if (tier >= 19 && tier <= 21) {
        return '19-21';
    } else if (tier >= 22 && tier <= 24) {
        return '22-24';
    } else if (tier >= 25 && tier <= 27) {
        return '25-27';
    } else if (tier >= 28 && tier <= 30) {
        return '28-30';
    } else if (tier >= 31 && tier <= 33) {
        return '31-33';
    } else if (tier >= 34 && tier <= 36) {
        return '34-36';
    } else if (tier >= 37 && tier <= 39) {
        return '37-39';
    } else if (tier >= 40 && tier <= 42) {
        return '40-42';
    } else if (tier >= 43 && tier <= 45) {
        return '43-45';
    } else {
        // Handle cases outside the defined ranges
        return 'Unknown';
    }
}


}






async function postUserInfo(username) {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    try {
        // Fetch the JSON data
        const response = await fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/json/users_info.json');
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
        const response = await fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/json/users_info.json');
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

function update_users_info(newUserInfo) {
    fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/write_user_info_json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUserInfo)
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
                fetchUserData(newUserInfo.username);
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