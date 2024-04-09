<<<<<<< HEAD
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
                fetchUserData();
            }
        });
    });
});

// Function to fetch user data and display on the profile page
function fetchUserData() {
    // Fetch the JSON data
    fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node0/json/user_info.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch userinfo.json');
                console.log(response);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Check if idkey1 exists
            if (data.idkey1) {
                // Extract user information
                const userInfo = data.idkey1;

                // Display the user information
                displayUserInfo(userInfo);
                displayUserPreferences(userInfo);
            } else {
                console.error('idkey1 not found in JSON data');
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
function displayUserPreferences(userInfo) {
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

    // Construct HTML to display count of elements
    let countHTML = '';
    let isFirst = true; // Flag to check if it's the first entry
    for (const [key, value] of Object.entries(countMap)) {
        if (!isFirst) {
            countHTML += ', ';
        }
        countHTML += `${key}: ${value}`;
        isFirst = false;
    }

    // Display user preferences with count of elements
    const userInfoDiv = document.getElementById('userPreferences');
    const userInfoHTML = `
        <h2 style="text-align: center;">Preferences</h2>
        <p>Preset: ${userInfo.preset.name}</p>
        <p>Exercise preferences: ${countHTML}</p>
    `;
    userInfoDiv.innerHTML = userInfoHTML;
}
=======
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
                fetchUserData();
            }
        });
    });
});

// Function to fetch user data and display on the profile page
function fetchUserData() {
    // Fetch the JSON data
    fetch('https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node0/json/user_info.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch userinfo.json');
                console.log(response);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Check if idkey1 exists
            if (data.idkey1) {
                // Extract user information
                const userInfo = data.idkey1;

                // Display the user information
                displayUserInfo(userInfo);
                displayUserPreferences(userInfo);
            } else {
                console.error('idkey1 not found in JSON data');
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
function displayUserPreferences(userInfo) {
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

    // Construct HTML to display count of elements
    let countHTML = '';
    let isFirst = true; // Flag to check if it's the first entry
    for (const [key, value] of Object.entries(countMap)) {
        if (!isFirst) {
            countHTML += ', ';
        }
        countHTML += `${key}: ${value}`;
        isFirst = false;
    }

    // Display user preferences with count of elements
    const userInfoDiv = document.getElementById('userPreferences');
    const userInfoHTML = `
        <h2 style="text-align: center;">Preferences</h2>
        <p>Preset: ${userInfo.preset.name}</p>
        <p>Exercise preferences: ${countHTML}</p>
    `;
    userInfoDiv.innerHTML = userInfoHTML;
}
>>>>>>> 480828e9e4f479adde5962e82825a811f5e81b86
