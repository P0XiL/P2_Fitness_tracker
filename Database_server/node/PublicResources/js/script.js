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
        <p>Height: ${userInfo.health.height}</p>
        <p>Weight: ${userInfo.health.weight}</p>
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

    slidersHTML = `
        <div>
            <label for="pushups">Pushups</label>
            <input type="range" id="pushups" name="pushups" min="1" max="10" value="${countMap['push-ups'] || 1}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('pushups', this.value)">
            <span id="pushupsCounter">${countMap['push-ups'] || 1}</span>
        </div>
        <div>
            <label for="run">Run</label>
            <input type="range" id="run" name="run" min="1" max="10" value="${countMap.run || 1}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('run', this.value)">
            <span id="runCounter">${countMap.run || 1}</span>
        </div>
        <div>
            <label for="walk">Walk</label>
            <input type="range" id="walk" name="walk" min="1" max="10" value="${countMap.walk || 1}" ${preset !== 'custom' ? 'disabled' : ''} onchange="updateCounter('walk', this.value)">
            <span id="walkCounter">${countMap.walk || 1}</span>
        </div>
    `;
    
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
    }
}



function updateCounter(exercise, value) {
    document.getElementById(`${exercise}Counter`).textContent = value;
}


function postCustomData(username) {
    const pushupsValue = document.getElementById('pushups').value;
    const runValue = document.getElementById('run').value;
    const walkValue = document.getElementById('walk').value;

    const newUserInfo = {
        username: username,
        preset: {
            name: 'custom',
            conf: [
                ...Array(Number(pushupsValue)).fill('push-ups'),
                ...Array(Number(runValue)).fill('run'),
                ...Array(Number(walkValue)).fill('walk')
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
            <input type="range" id="${exercise}" name="${exercise}" min="1" max="10" value="${count}" disabled>
            <span>${count}</span>
        </div>
    `).join('');
}

function updatePreset(username, preset) {
    let conf = [];
    if (preset === 'run') {
        conf = ['run','run','run','run','run','run','run','run','run','run',
        'walk','walk','walk','walk',
        'crunches','crunches','crunches'];
    } 
    else if (preset === 'walk') {
        conf = ['run','run','run','run',
        'walk','walk','walk','walk','walk','walk','walk','walk','walk','walk',
        'crunches','crunches','crunches','crunches','crunches','crunches'];
    }

    else if (preset === 'strength') {
        conf = ['run','run',
        'walk','walk',
        'crunches','crunches','crunches','crunches','crunches','crunches',
        'push-ups','push-ups','push-ups','push-ups',];
    }

    else if (preset === 'custom') {
        conf = ['run','run',
        'walk','walk',
        'crunches','crunches','crunches','crunches','crunches','crunches',
        'push-ups','push-ups','push-ups','push-ups',
        ];
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


