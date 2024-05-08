const serverPath = 'http://127.0.0.1:3360/';

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

// LOCALHOST: https://127.0.0.1:3360
// SERVER: https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/


// The function which enables tab switching
document.addEventListener('DOMContentLoaded', function () {
    // Call checkLoginState() on page load
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
            // Create an object with username and password
            const userData = {
                username: username,
                password: password
            };

            // Send the data to the server-side script for file writing
            //console.log(username);
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
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();

        localStorage.removeItem('loginState'); // Remove the login state from localStorage

        location.reload(); // Reload the page to reflect the logout
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

    document.getElementById('toggleAddFriendsPage').addEventListener('click', function (e) {
        e.preventDefault();
    
        const addFriendsPage = document.getElementById('addFriends');
        const friendsPage = document.getElementById('friends');
    
        friendsPage.classList.remove('active');
        addFriendsPage.classList.add('active');
    
    
    });

    document.getElementById('friendSubmitBtn').addEventListener('click', function (e) {
        e.preventDefault();

        const friend_username = document.querySelector('input[name="friend_username"]').value;
        
        const friend_data = {
            friends: friend_username
        }

        saveFriend(friend_data);
    });

});

function saveFriend(friendData) {
    const username = localStorage.getItem('username'); // Retrieve the username from local storage
    friendData.username = username; // Add the username to the friendData object
    fetch(serverPath + 'addFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(friendData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Optionally, handle success response
        console.log('Friend added successfully:', data);
    })
    .catch(error => {
        console.error('Error adding friend:', error);
    });
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

                storeLoginState(userData.username);

                location.reload();
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

// Function to display login error message
function displayLoginErrorMessage(message) {
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    loginErrorMessage.textContent = message;
    loginErrorMessage.style.color = 'red';
}

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
        const masteryDiv = createMasteryItem(masteryKey, mastery);
        userMasteriesDiv.appendChild(masteryDiv);
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
                const masteryDiv = createMasteryItem(masteryKey, mastery);
                userMasteriesDiv.appendChild(masteryDiv);
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

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayUserInfo(username, userInfo) {
    const userInfoDiv = document.getElementById('userInfo');
    let userInfoHTML = `
        <h2 style="text-align: center;">User info</h2>
        <p>Height: <input type="number" id="height" value="${userInfo.health.height}" > cm</p>
        <p>Weight: <input type="text" id="weight" value="${userInfo.health.weight}" > kg</p>
        <button onclick="postUserInfo('${username}')">Save User Info</button>
        <p><span id="bmiText" style="font-size: 14px; margin-top: 5px;"></span></p>
        <canvas id="bmiGraph" width="600" height="400"></canvas>
    `;
    userInfoDiv.innerHTML = userInfoHTML;

    // Calculate and display initial BMI if height and weight are present
    const height = parseFloat(userInfo.health.height);
    const weight = parseFloat(userInfo.health.weight);
    if (!isNaN(height) && !isNaN(weight)) {
        updateBMI(height, weight);
    }
}

// Function to update BMI text
function updateBMI(height, weight) {
    const bmi = calculateBMI(height, weight);
    const bmiText = document.getElementById('bmiText');
    bmiText.textContent = `BMI: ${bmi}`;

    // Display warning if BMI is over 25 or under 18.5
    if (bmi > 30){
        bmiText.innerHTML += `<br><span>BMI is over 30 leading to a lot higher possibily of diseases 
        such as cardiovascular diseases. Try to limit calorie intake. This can be done by drinking more water, 
        eating less fatty foods, using smaller plates among many other ways of reducing body weight. For more information on how to 
        lose weight, visit <a href="https://www.health.harvard.edu/topics/diet-and-weight-loss" target="_blank">
        Harvard Health Publishing</a>.</span>`;
    }
    else if (bmi > 25) {
        bmiText.innerHTML += `<br><span>BMI is over 25 leading to a sligtly higher possibily of diseases
         such as cardiovascular diseases. Try to limit calorie intake. This can be done by drinking more water, 
         eating less fatty foods, using smaller plates among many other ways of reducing body weight. For more information on how to 
         lose weight, visit <a href="https://www.health.harvard.edu/topics/diet-and-weight-loss" target="_blank">
         Harvard Health Publishing</a>.</span>`;
    } else if (bmi < 18.5) {
        bmiText.innerHTML += `<br><span>BMI is under 18.5. Try to ingest more calories. 
        This can be done by adding in small extra meals around 300-500 calories, drinking high-calorie drinks such as milkshakes,
        adding more protein to your diet among other things. For more information on how to 
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
    categories.forEach(function(category, index) {
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
        } else {
            console.error('User info not found for username:', username);
        }
    } catch (error) {
        console.error('Error fetching user data:', error.message);
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

function clearCreateErrorMessage() {
    const errorMessage = document.getElementById('createErrorMessage');
    errorMessage.textContent = '';
}

// Function to clear login error message
function clearLoginErrorMessage() {
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    loginErrorMessage.textContent = '';
}

function displayCreateErrorMessage(message) {
    const errorMessage = document.getElementById('createErrorMessage');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
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

function validateIntegerInput(value) {
    // Check if the value is a valid number and an integer
    if (!isNaN(value) && Number.isInteger(value)) {
        // Check if the value is greater than or equal to 0
        if (value >= 0) {
            // Input is valid
            return true;
        } else {
            // Input is negative
            console.error('Input must be a positive integer.');
            return false;
        }
    } else {
        // Input is not a valid integer
        console.error('Input must be a valid integer.');
        return false;
    }
}


// Function to update user info
function update_users_info(newUserInfo) {
    //console.log("new user info:");
    //console.log(newUserInfo);
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
            //console.log(response);
            return response.json(); // Read response JSON
        })
        .then(responseJson => {
            //console.log('Response from POST:', responseJson);
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














