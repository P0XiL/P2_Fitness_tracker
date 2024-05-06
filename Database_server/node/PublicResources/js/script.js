const serverPath = 'http://127.0.0.1:3360/';


// The function which enables tab switching
document.addEventListener('DOMContentLoaded', function () {
    // Call checkLoginState() on page load
    //window.addEventListener('load', checkLoginState);
    checkLoginState();
    setupTiersForQuestPage(localStorage.getItem('username'));

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
                setupProfilePage(localStorage.getItem('username'));
            }
            else if (targetId === 'main') { // Check if the clicked tab is the quest page
                setupTiersForQuestPage(localStorage.getItem('username')); // Call setupTiersForQuestPage with the appropriate username
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
        } else if (password.length < 1) {
            displayCreateErrorMessage("Password must be at least 1 character");
        } else if (username.length < 1) {
            displayCreateErrorMessage("Username must be at least 1 character");
        }
        else {
            clearCreateErrorMessage();

            // Create an object with username and password
            const userData = {
                username: username,
                password: password
            };

            // Send the data to the server-side script for file writing
            console.log(username);
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
});

//Function which highlights the link of the currently selected tab
function highlightNavLink(pageId) {
    // Remove 'active' class from all navigation links
    const navLinks = document.querySelectorAll('#side-nav a');
    navLinks.forEach(function (link) {
        link.classList.remove('active');
    });
    // Add 'active' class to the corresponding navigation link
    const activeLink = document.querySelector('#side-nav a[href="#' + pageId + '"]');
    activeLink.classList.add('active');
}

// Function to handle storing login state
function storeLoginState(username) {
    const expirationTime = new Date().getTime() + (30 * 60 * 1000); // 30 minutes expiration
    const loginState = {
        username: username,
        expiration: expirationTime
    };
    localStorage.setItem('loginState', JSON.stringify(loginState));
    localStorage.setItem('username', username);
}

// Function to check and handle login state on page load
function checkLoginState() {
    const loginState = localStorage.getItem('loginState');
    const sidenavigation = document.getElementById('side-nav');
    const topnavigation = document.getElementById('top-nav');

    if (loginState) {
        const parsedLoginState = JSON.parse(loginState);
        if (parsedLoginState.expiration > new Date().getTime()) {
            // Log the user in automatically
            const username = parsedLoginState.username;
            loginUser({ username: username });

            // Update UI to display logged-in username
            document.getElementById('usernameDisplay').textContent = "Hello, " + username;
            document.getElementById('profile_Username').querySelector('.heading').textContent = "" + username;

            sidenavigation.style.display = 'block';
            topnavigation.style.display = 'block';
            document.getElementById('main').classList.add('active');
        } else {
            // Clear expired login state
            localStorage.removeItem('loginState');
            loginPage.classList.add('active');
        }
    } else {
        sidenavigation.style.display = 'none';
        topnavigation.style.display = 'none';
        loginPage.classList.add('active');
    }
}


function loginUser(loginData) {
    fetch(serverPath+'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (response.ok) {
                console.log('User successfully logged in');
                clearLoginErrorMessage();

                storeLoginState(loginData.username);

                location.reload();

            } else {
                response.text().then(errorMessage => {
                    displayLoginErrorMessage(errorMessage);
                });
            }
        });
}

// Function to send data to server-side script
function createUser(userData) {
    fetch(serverPath+'createUser', { // Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/writeUserData, or http://127.0.0.1:3364/writeUserData depending on localhost or server host
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok) {
                console.log('Data successfully sent to server');

                clearCreateErrorMessage();

                highlightNavLink('main');

                storeLoginState(userData.username);

                document.getElementById('surveyForm').classList.add('active');
                document.getElementById('createAccount').classList.remove('active');

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
        const response = await fetch(serverPath+'json/users_info.json');
        
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


async function setupProfilePage(username) {
    try {
        // Fetch user data using fetchUserData
        const userData = await fetchUserData(username);

        // Log the fetched JSON data to the console
        console.log('Fetched JSON data:', userData);

        // Process the JSON data here
        processData(userData, username);

        // Return the user info
        return userData;
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error; // Re-throw the error for handling by the caller
    }
}

function processData(data, username) {
    // Check if the data is not null or undefined
    if (data) {
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

            // Create grid items for daily, weekly, and monthly tiers
            createTierGridItem(dailyTierContainer, tierNames[getSubTierRange(userInfo.tier.daily.rank)], dailyImageSrc, userInfo.tier.daily.elo, 'Daily');
            createTierGridItem(weeklyTierContainer, tierNames[getSubTierRange(userInfo.tier.weekly.rank)], weeklyImageSrc, userInfo.tier.weekly.elo, 'Weekly');
            createTierGridItem(monthlyTierContainer, tierNames[getSubTierRange(userInfo.tier.monthly.rank)], monthlyImageSrc, userInfo.tier.monthly.elo, 'Monthly');
        } else {
            console.error(`'tier' property or its daily, weekly, or monthly sub-properties not found in userInfo`);
        }
    } else {
        console.error('User info is null or undefined');
    }

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
    const masteryHeader = document.createElement('h3');
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

async function postUserInfo(username) {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    try {
        const userData = await fetchUserData(username); // Assuming fetchUserData is a function to fetch user data

        if (userData && userData.username === username) {
            const existingUserInfo = userData;

            // Create a new user info object with the updated health information
            const newUserInfo = {
                username: username,
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
        console.error('Error fetching user data:', error);
    }
}


// Function to update user info
function update_users_info(newUserInfo) {
    fetch(serverPath+'write_user_info_json', {
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
            console.log(response);
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

async function setupTiersForQuestPage(username) {
    try {
        const userData = await fetchUserData(username);

        // Log the JSON object fetched to the console
        console.log('Fetched JSON data:', userData);

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



// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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


function displayUserPreferences(username, userInfo) {
    const preset = userInfo.preset.name;
    const confObject = userInfo.preset.conf || {}; // Ensure confObject is an object

    // Generate sliders for exercise preferences
    const userInfoDiv = document.getElementById('userPreferences');
    let slidersHTML = '';

    // Check if each exercise exists in the confObject, then include the slider
    if (confObject['pushups'] !== undefined || preset === 'custom') {
        slidersHTML += `
            <div>
                <label for="pushups">Pushups</label>
                <input type="range" id="pushups" name="pushups" min="0" max="10" value="${confObject['pushups'] || 0}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('pushups', this.value)">
                <span id="pushupsCounter">${confObject['pushups'] || 0}</span>
            </div>
        `;
    }
    if (confObject['run'] !== undefined || preset === 'custom') {
        slidersHTML += `
            <div>
                <label for="run">Run</label>
                <input type="range" id="run" name="run" min="0" max="10" value="${confObject['run'] || 0}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('run', this.value)">
                <span id="runCounter">${confObject['run'] || 0}</span>
            </div>
        `;
    }
    if (confObject['walk'] !== undefined || preset === 'custom') {
        slidersHTML += `
            <div>
                <label for="walk">Walk</label>
                <input type="range" id="walk" name="walk" min="0" max="10" value="${confObject['walk'] || 0}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('walk', this.value)">
                <span id="walkCounter">${confObject['walk'] || 0}</span>
            </div>
        `;
    }
    if (confObject['crunches'] !== undefined || preset === 'custom') {
        slidersHTML += `
            <div>
                <label for="crunches">Crunches</label>
                <input type="range" id="crunches" name="crunches" min="0" max="10" value="${confObject['crunches'] || 0}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('crunches', this.value)">
                <span id="crunchesCounter">${confObject['crunches'] || 0}</span>
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
        updateCounter('pushups', confObject['pushups'] || 0);
        updateCounter('run', confObject['run'] || 0);
        updateCounter('walk', confObject['walk'] || 0);
        updateCounter('crunches', confObject['crunches'] || 0);
    }
}


function updateCounter(exercise, value) {
    document.getElementById(`${exercise}Counter`).textContent = value;
}

async function postCustomData(username) {
    const pushupsValue = document.getElementById('pushups').value;
    const runValue = document.getElementById('run').value;
    const walkValue = document.getElementById('walk').value;
    const crunchesValue = document.getElementById('crunches').value;

    try {
        const userData = await fetchUserData(username);

        if (userData && userData.username === username) {
            const existingUserInfo = userData;

            const newUserInfo = {
                username: username,
                health: existingUserInfo.health,
                mastery: existingUserInfo.mastery,
                hiddenRank: existingUserInfo.hiddenRank,
                tier: existingUserInfo.tier,
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

            // Call function to update user info
            update_users_info(newUserInfo);
        } else {
            console.error('User info not found for username:', username);
        }
    } catch (error) {
        console.error('Error fetching user data:', error.message);
    }
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
        const userData = await fetchUserData(username);

        if (userData && userData.username === username) {
            const existingUserInfo = userData;

            let conf = [];
            switch (preset) {
                case 'run':
                    conf = {
                        run: 10,
                        walk: 4,
                        crunches: 3
                    }
                    break;
                case 'walk':
                    conf = {
                        run: 4,
                        walk: 10,
                        crunches: 3
                    }
                    break;
                case 'strength':
                    conf = {
                        run: 2,
                        walk: 2,
                        crunches: 6,
                        pushUps: 4
                    }
                    break;
                case 'custom':
                    conf = {
                        run: 1,
                        walk: 1,
                        crunches: 1,
                        pushUps: 1
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
            console.log(newUserInfo.preset);

            // Update the user info on the server
            update_users_info(newUserInfo);
        } else {
            console.error('User info not found for username:', username);
        }
    } catch (error) {
        console.error('Error fetching user data:', error.message);
    }
}


// Calculate BMI function
function calculateBMI(height, weight) {
    // Convert height to meters
    const heightMeters = height / 100;
    // Calculate BMI
    const bmi = weight / (heightMeters * heightMeters);
    return bmi.toFixed(1); // Round to 1 decimal place
}

document.addEventListener('DOMContentLoaded', function() {
    function handleSurveyFormSubmit() {
        const form = document.getElementById('surveyForm');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Extracting specific parameters from form data
            const formData = new FormData(form);
            const surveyData = {};
            for (const [key, value] of formData.entries()) {
                surveyData[key] = value;
            }
            
            // Retrieve user ID from local storage
            const userId = localStorage.getItem("username");
            if (userId) {
                surveyData.userid = userId;
            } else {
                console.error('User ID not found in local storage');
                return;
            }
            
            console.log('Survey data:', surveyData);
            sendSurveyData(surveyData);

            // Set a flag in local storage indicating that the user has completed the survey
            localStorage.setItem('surveyCompleted', 'true');

            location.reload();

            document.getElementById('main').classList.add('active');
            document.getElementById('surveyForm').classList.remove('active');

        });
    }

    // Call the function to attach the event listener
    handleSurveyFormSubmit();
});

function sendSurveyData(surveyData) {
    fetch(serverPath+'write_survey_data_json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch POST');
        }
        return response.json();
    })
    .then(responseJson => {
        console.log('Response from POST:', responseJson);
        if (responseJson.success) {
            console.log('Survey data sent successfully');
        } else {
            console.error('Failed to send survey data:', responseJson.message);
        }
    })
    .catch(error => {
        console.error('Error sending survey data:', error);
    });
}

let lastActiveDates = {};

function updateStreak() {
  const currentDate = new Date().toDateString();
  let userId = localStorage.getItem("username");
  
  if (!lastActiveDates[userId]) {
    lastActiveDates[userId] = null;
  }
  
  if (currentDate === lastActiveDates[userId]) {
    return; // Already active today
  }
  
  const lastDate = new Date();
  lastDate.setDate(lastDate.getDate() - 1);
  
  const lastDateString = lastDate.toDateString();
  
  if (currentDate === lastDateString) {
    if (lastActiveDates[userId] !== currentDate) {
      lastActiveDates[userId] = currentDate;
    }
  } else {
    lastActiveDates[userId] = currentDate;
  }
}

function getStreakCount() {
  let userId = localStorage.getItem("username");
  let streakCount = 0;
  let currentDate = new Date().toDateString();
  let lastDate = null;

  if (lastActiveDates[userId]) {
    lastDate = new Date(lastActiveDates[userId]);
  }

  if (lastDate) {
    while (currentDate === lastDate.toDateString()) {
      streakCount++;
      lastDate.setDate(lastDate.getDate() - 1);
      currentDate = lastDate.toDateString();
    }
  }

  streakCount = getStreakCount(userId);
  console.log("Current streak for user", userId + ":", streakCount);

  return streakCount;
}

updateStreak(); // Call this function whenever user is active



// Display PNG image if streak is active
if (getStreakCount < 1) {
  const img = document.createElement("img");
  img.src = "Database_server\node\PublicResources\image\Streak.png";
  document.body.appendChild(img);
}
