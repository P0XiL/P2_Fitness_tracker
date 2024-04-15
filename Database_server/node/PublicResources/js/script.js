
// The function which enables tab switching
document.addEventListener('DOMContentLoaded', function () {
    // Assigns all tabs to an array called links
    const links = document.querySelectorAll('nav a');

    // Add click event listener to all buttons for tabs
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            // Disables the hyperref linking from the tab itself since we arent redirecting, but instead showing and hiding specific pages
            e.preventDefault();

            // Remove 'active' class from all tabs
            document.querySelectorAll('.page').forEach(function (page) {
                page.classList.remove('active');
            });

            // Get the id for the tab which has been clicked
            const targetId = this.getAttribute('href').substring(1);

            // Add 'active' class to tab which has been clicked
            document.getElementById(targetId).classList.add('active');
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
    
    
    function loginUser(loginData) {
        fetch('http://127.0.0.1:3364/login', {
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
        fetch('http://127.0.0.1:3364/createUser', { // Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node4/writeUserData, or http://127.0.0.1:3364/writeUserData depending on localhost or server host
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
                    document.getElementById('loginpage').classList.remove('active');
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