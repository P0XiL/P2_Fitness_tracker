// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => store[key] = value,
        clear: () => store = {},
        removeItem: (key) => delete store[key],
    };
})();
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock fetch
function mockFetch(response, success = true) {
    return function() {
        return Promise.resolve({
            ok: success,
            json: () => Promise.resolve(response),
            text: () => Promise.resolve(JSON.stringify(response))
        });
    };
}

// Define the functions from script.js
function storeLoginState(username) {
    const expirationTime = new Date().getTime() + (30 * 60 * 1000); // 30 minutes expiration
    const loginState = { username, expiration: expirationTime };
    localStorage.setItem('loginState', JSON.stringify(loginState));
    localStorage.setItem('username', username);
}

function loginUser(loginData) {
    return fetch('serverPath/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            storeLoginState(loginData.username);
        } else {
            return response.text().then(errorMessage => {
                console.error(errorMessage);
            });
        }
    });
}

function createUser(userData) {
    return fetch('serverPath/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            storeLoginState(userData.username);
        } else {
            return response.text().then(errorMessage => {
                console.error(errorMessage);
            });
        }
    });
}

// Test storeLoginState function
function testStoreLoginState() {
    console.log("Running testStoreLoginState...");

    // Arrange
    localStorage.clear();
    const username = 'testUser';
    const expectedExpirationTime = new Date().getTime() + (30 * 60 * 1000);

    // Act
    storeLoginState(username);

    // Assert
    const storedLoginState = JSON.parse(localStorage.getItem('loginState'));
    if (storedLoginState.username !== username) {
        console.error(`Expected username to be ${username}, but got ${storedLoginState.username}`);
    }
    if (storedLoginState.expiration < expectedExpirationTime) {
        console.error(`Expected expiration time to be at least ${expectedExpirationTime}, but got ${storedLoginState.expiration}`);
    }

    const storedUsername = localStorage.getItem('username');
    if (storedUsername !== username) {
        console.error(`Expected username to be ${username}, but got ${storedUsername}`);
    }

    console.log("testStoreLoginState completed.");
}

// Test loginUser function
function testLoginUser() {
    console.log("Running testLoginUser...");

    // Arrange
    localStorage.clear();
    const loginData = { username: 'testUser', password: 'testPass' };
    window.fetch = mockFetch({ message: 'User successfully logged in' });

    // Act
    loginUser(loginData).then(() => {
        // Assert
        const storedLoginState = JSON.parse(localStorage.getItem('loginState'));
        const storedUsername = localStorage.getItem('username');

        if (storedLoginState.username !== loginData.username) {
            console.error(`Expected username to be ${loginData.username}, but got ${storedLoginState.username}`);
        }
        if (!storedLoginState.expiration) {
            console.error(`Expected expiration time to be set, but got ${storedLoginState.expiration}`);
        }
        if (storedUsername !== loginData.username) {
            console.error(`Expected username to be ${loginData.username}, but got ${storedUsername}`);
        }

        console.log("testLoginUser completed.");
    });
}

// Test createUser function
function testCreateUser() {
    console.log("Running testCreateUser...");

    // Arrange
    localStorage.clear();
    const userData = { username: 'testUser', password: 'testPass' };
    window.fetch = mockFetch({ message: 'Data successfully sent to server' });

    // Act
    createUser(userData).then(() => {
        // Assert
        const storedLoginState = JSON.parse(localStorage.getItem('loginState'));
        const storedUsername = localStorage.getItem('username');

        if (storedLoginState.username !== userData.username) {
            console.error(`Expected username to be ${userData.username}, but got ${storedLoginState.username}`);
        }
        if (!storedLoginState.expiration) {
            console.error(`Expected expiration time to be set, but got ${storedLoginState.expiration}`);
        }
        if (storedUsername !== userData.username) {
            console.error(`Expected username to be ${userData.username}, but got ${storedUsername}`);
        }

        console.log("testCreateUser completed.");
    });
}

// Run the tests
testLoginUser();
testCreateUser();
testStoreLoginState();
