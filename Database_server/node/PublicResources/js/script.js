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
        fetch('http://127.0.0.1:3360/login', {
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
        fetch('http://127.0.0.1:3360/createUser', { // Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node4/writeUserData, or http://127.0.0.1:3364/writeUserData depending on localhost or server host
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
                    document.getElementById('surveyForm').classList.add('active');
                    highlightNavLink('main');
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

function fetchUserData(username) {
    // Fetch the JSON data
    fetch('http://127.0.0.1:3360/json/users_info.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch userinfo.json: ${response.statusText}`);
            }
            return response.json(); // Parse response body as JSON
        })
        .then(data => {
            console.log(data);
            // Process the JSON data here
            processData(data, username);
        })
        .catch(error => console.error('Error fetching JSON:', error));
}


function processData(data, username) {
    // Check if users_info exists in data
    if (data.users_info) {
        // Check if the specified username exists
        if (username && data.users_info[username]) {
            // Extract user information
            const userInfo = data.users_info[username];

            // Display the user information
            displayUserInfo(userInfo);
            displayUserPreferences(username, userInfo); // Pass username to displayUserPreferences
        } else {
            console.error(`${username} not found in JSON data`);
        }
    } else {
        console.error('users_info not found in JSON data');
    }
}

// Function to display user information
function displayUserInfo(userInfo) {
    const userInfoDiv = document.getElementById('userInfo');
    const userInfoHTML = `
        <h2 style="text-align: center;">User info</h2>
        <p>Height: ${userInfo[idkey].surveyData.height}</p>
        <p>Weight: ${userInfo[idkey].surveyData.weight}</p>
    `;
    userInfoDiv.innerHTML = userInfoHTML;
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

function updatePreset(username, preset) {
    let conf = [];
    let run = 10;
    let walk = 4;
    let crunches = 3;

    switch (preset) {
        case 'run':
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
    }
    

    // Define the new user info object
    const newUserInfo = {
        username: username,
        preset: {
            name: preset,
            conf: conf
        }
    };

    // Update the user info on the server
    update_users_info(newUserInfo);
}



function update_users_info(newUserInfo) {
    fetch('http://127.0.0.1:3360/write_user_info_json', {
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

document.addEventListener('DOMContentLoaded', function() {
    function handleSurveyFormSubmit() {
        const form = document.getElementById('surveyForm');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Extracting specific parameters from form data
            const formData = new FormData(form);
            const surveyData = {};
            for (const [key, value] of formData.entries()) {
                if (surveyData[key]) {
                    if (!Array.isArray(surveyData[key])) {
                        surveyData[key] = [surveyData[key]];
                    }
                    surveyData[key].push(value);
                } else {
                    surveyData[key] = value;
                }
            }
            console.log(surveyData);
            sendSurveyData(surveyData);

            document.getElementById('main').classList.add('active');
            document.getElementById('surveyForm').classList.remove('active')
        });
    }

    // Call the function to attach the event listener
    handleSurveyFormSubmit();
});

function sendSurveyData(surveyData) {
    fetch('http://127.0.0.1:3360/write_survey_data_json', {
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

function updateStreak(userId) {
  const currentDate = new Date().toDateString();
  
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

function getStreakCount(userId) {
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

  return streakCount;
}

updateStreak(userId); // Call this function whenever user is active
const streakCount = getStreakCount(userId);
console.log("Current streak for user", userId + ":", streakCount);

// Display PNG image if streak is active
if (streakCount > 0) {
  const img = document.createElement("img");
  img.src = "Database_server\node\PublicResources\image\Streak.png";
  document.body.appendChild(img);
}
