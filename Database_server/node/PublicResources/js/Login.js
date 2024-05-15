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

            // Retrieve survey completion status from local storage
            const userSurveyKey = `surveyCompleted_${username}`;
            const surveyCompleted = localStorage.getItem(userSurveyKey);

            // Check if survey is completed, and update UI accordingly
            if (surveyCompleted === 'true') {
                document.getElementById('surveyForm').classList.remove('active');
            } else {
                document.getElementById('main').classList.remove('active');
                document.getElementById('surveyForm').classList.add('active');
                sidenavigation.style.display = 'none';
                topnavigation.style.display = 'none';
            }
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
