// The function which enables tab switching
document.addEventListener('DOMContentLoaded', function () {
    // Assigns all tabs to an array called links
    const links = document.querySelectorAll('nav a');

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
        });
    });
});

function fetchUserData(username) {
    // Fetch the JSON data
    fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/json/users_info.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch userinfo.json');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Check if users_info exists in data
            if (data.users_info) {
                // Check if the specified username exists
                if (username && data.users_info[username]) {
                    // Extract user information
                    const userInfo = data.users_info[username];

                    // Display the user information
                    displayUserInfo(userInfo);
                    displayUserPreferences(username, userInfo); // Pass username to displayUserPreferences
                    
                    // Update the dropdown menu with the current preset
                    const presetDropdown = document.getElementById('presetDropdown');
                    presetDropdown.value = userInfo.preset.name; // Assuming preset.name holds the current preset value
                } else {
                    console.error(`${username} not found in JSON data`);
                }
            } else {
                console.error('users_info not found in JSON data');
            }
        })
        .catch(error => console.error('Error fetching JSON:', error));
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

// Function to display user preferences
function displayUserPreferences(username, userInfo) { // Accept username as parameter
    const confArray = userInfo.preset.conf.replace('[', '').replace(']', '').split(',');
    const countMap = {};
    
    // Filter out empty strings or undefined values
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
    const slidersHTML = generateSliders(countMap);
    
    const userInfoHTML = `
        <h2 style="text-align: center;">Preferences</h2>
        <label for="presetDropdown">Choose a preset:</label>
        <select id="presetDropdown" onchange="updatePreset('${username}', this.value)"> <!-- Pass 'username' as parameter -->
            <option value="run">Run</option>
            <option value="walk">Walk</option>
            <option value="crunches">Crunches</option>
        </select>
        <button id="customPresetBtn">Custom Preset</button>
        <p>Exercise preferences:</p>
        ${slidersHTML}
    `;
    userInfoDiv.innerHTML = userInfoHTML;
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

function updatePreset(username, preset) { // Accept username as parameter
    let conf = '';
    if (preset === 'run') {
        conf = '[run,run,run,run,run,run,run,run,run,run,walk,walk,walk,walk,hip-thrust-into-jacob,hip-thrust-into-jacob,hip-thrust-into-jacob,hip-thrust-into-jacob,crunches,crunches,crunches]';
    } else if (preset === 'walk') {
        conf = '[run,run,run,run,walk,walk,walk,walk,walk,walk,walk,walk,walk,walk,crunches,crunches,crunches,crunches,crunches,crunches]';
    }
    // Fetch the JSON data
    fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/json/users_info.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users_info.json');
            }
            return response.json();
        })
        .then(data => {
            // Check if the data structure is as expected
            if (data.users_info && data.users_info[username] && data.users_info[username].preset) { // Use username parameter
                // Update the preset for the specified username
                data.users_info[username].preset.name = preset;
                data.users_info[username].preset.conf = conf;
                // Send the updated data to the server
                fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/json/users_info.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update preset on server');
                    }
                    console.log('Preset updated successfully');
                    // Fetch user data again after the POST promise has been fulfilled
                    fetchUserData(username);
                })
                .catch(error => console.error('Error updating preset:', error));
                console.log('hej');
            } else {
                console.error('Unexpected JSON structure or username not found:', data);
            }
        })
        .catch(error => console.error('Error fetching JSON:', error));
}
