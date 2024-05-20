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

// Override the browser's localStorage with the mock
window.localStorage = localStorageMock;

// Test the storeLoginState function
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

// Run the test
testStoreLoginState();
