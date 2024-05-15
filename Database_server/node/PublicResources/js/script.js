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
                alert('Username cannot contain numbers.');
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

            // Set a flag in local storage indicating that the user has completed the survey
            const userSurveyKey = `surveyCompleted_${userId}`;
            localStorage.setItem(userSurveyKey, 'true');

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

    document.getElementById('toggleFriendPageLink').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior

        const userfriendpage = document.getElementById('userfriend');
        const friendPage = document.getElementById('friends');

        friendPage.classList.remove('active');
        userfriendpage.classList.add('active');
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

            listItem.appendChild(link);

            list.appendChild(listItem);
        });

        container.appendChild(list);
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
if (getStreakCount > 0) {
    const img = document.createElement("img");
    img.src = "Database_server\node\PublicResources\image\Streak.png";
    document.body.appendChild(img);
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
