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

            if(targetId === 'friends'){
                friendList();
            }

            if(targetId === 'stats'){
                individual_type(localStorage.getItem('username'), "statsTextUser");
            }

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

    function handleSurveyFormSubmit() {
        const form = document.getElementById('surveyForm');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var NameInput = document.getElementById('name');

            if (/\d/.test(NameInput.value)) {
                alert('Name cannot contain numbers.');
                return;
            }

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

            location.reload();

            document.getElementById('main').classList.add('active');
            document.getElementById('surveyForm').classList.remove('active');

        });
    }

    // Call the function to attach the event listener
    handleSurveyFormSubmit();

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
    document.getElementById('createAccountForm').addEventListener('submit', function (e) {
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
            createUser(userData);
        }
    });

    document.getElementById('loginForm').addEventListener('submit', function (e) {
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
                response.text().then(errorMessage => {
                    displayFriendErrorMessage(errorMessage); // Display error message for friend-related errors
                });
            } else {
                clearFriendErrorMessage();
            }
        })
        .then(data => {
            // Handle success response here if needed
            console.log('Friend added successfully:', data);
        })
        .catch(error => {
            console.error('Error adding friend:', error);
        });
}

// Function to display login error message
function displayFriendErrorMessage(message) {
    const loginErrorMessage = document.getElementById('friendErrorMessage');
    loginErrorMessage.textContent = message;
    loginErrorMessage.style.color = 'red';
}
function clearFriendErrorMessage() {
    const loginErrorMessage = document.getElementById('friendErrorMessage');
    loginErrorMessage.textContent = '';
}

document.getElementById('friendSubmitBtn').addEventListener('click', function() {
    friendList();
});


function friendList() {
    fetchJSON("json/users_info.json")
    .then(data => {
        const username = localStorage.getItem("username");
        const container = document.getElementById("friendslist")
        container.innerHTML = "";

        const friends = data.users_info[username].friends;

        const list = document.createElement("ul");
        list.classList.add("friend-list");

        friends.forEach(function(friend) {
            const listItem = document.createElement("li");
            listItem.classList.add("friend-item");

            const link = document.createElement("a");
            link.href = "#";
            link.textContent = "- " + friend.charAt(0).toUpperCase() + friend.slice(1);
            link.className = "friend-link";

            link.addEventListener("click", function(event) {
                event.preventDefault();
                buttonClicked(friend);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-button";

            deleteButton.addEventListener("click", function(event) {
                event.stopPropagation(); // Prevent click event on the link
                deleteFriend(friend, listItem); // Pass the listItem to deleteFriend function
            });

            listItem.appendChild(link);
            listItem.appendChild(deleteButton);

            list.appendChild(listItem);
        });

        container.appendChild(list);
    });
}

function deleteFriend(friend, listItem) {
    const username = localStorage.getItem('username');
    const requestData = {
        username: username,
        friend: friend
    };

    fetch('deleteFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete friend.');
        }
        console.log("Friend deleted successfully.");
        // Remove the listItem from the DOM
        listItem.remove();
        // Optional: Reload or update UI to reflect changes
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



function buttonClicked(friend) {
    const addFriendsPage = document.getElementById('userfriend');
    const friendsPage = document.getElementById('friends');

    friendsPage.classList.remove('active');
    addFriendsPage.classList.add('active');

    if(localStorage.getItem("friend") !== null){
        localStorage.removeItem("friend")
    }
    localStorage.setItem("friend", friend);

    friendtext("Friendheader", "friendheader2");
    const container = document.getElementById("statsTextFriend")
    container.innerHTML = "";
    individual_type(friend, "statsTextFriend");
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

            // Fetch user data from the server
            fetch(serverPath + 'users_info.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(data => {
                const userData = data.users_info[username];
                if (userData && userData.health && userData.health.surveyCompleted === true) {
                    document.getElementById('surveyForm').classList.remove('active');
                } else {
                    document.getElementById('main').classList.remove('active');
                    document.getElementById('surveyForm').classList.add('active');
                    sidenavigation.style.display = 'none';
                    topnavigation.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // Handle error appropriately
            });
        
        } else {
            // Clear expired login state
            localStorage.removeItem('loginState');
            loginPage.classList.add('active');
        }
    } else {
        // No login state found, show login page
        sidenavigation.style.display = 'none';
        topnavigation.style.display = 'none';
        loginPage.classList.add('active');
    }
}


function loginUser(loginData) {
    fetch(serverPath + 'login', {
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
    fetch(serverPath + 'createUser', { // Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node9/writeUserData, or http://127.0.0.1:3364/writeUserData depending on localhost or server host
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

// Function to clear login error message
function clearLoginErrorMessage() {
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    loginErrorMessage.textContent = '';
}

function clearCreateErrorMessage() {
    const errorMessage = document.getElementById('createErrorMessage');
    errorMessage.textContent = '';
}

function displayCreateErrorMessage(message) {
    const errorMessage = document.getElementById('createErrorMessage');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
}


function sendSurveyData(surveyData) {
    fetch(serverPath + 'write_survey_data_json', {
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

//Function which highlights the link of the currently selected tab
function highlightNavLink(pageId) {
    // Remove 'active' class from all navigation links
    const navLinks = document.querySelectorAll('#side-nav a');
    navLinks.forEach(function (link) {
        link.classList.remove('active');
    });
    // Add 'active' class to the corresponding navigation link
    if (pageId==='profilepage'){
        return;
    } else {
        const activeLink = document.querySelector('#side-nav a[href="#' + pageId + '"]');
        activeLink.classList.add('active');
    }
}
