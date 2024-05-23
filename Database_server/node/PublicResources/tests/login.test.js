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

// Mocking the fs module and http module
const fsMock = {
    readFile: (path, callback) => {
        if (path === 'PublicResources/json/users.json') {
            callback(null, JSON.stringify({
                obj_users: {
                    testUser: { password: 'testPass' }
                }
            }));
        } else if (path === 'PublicResources/json/quest_log.json') {
            callback(null, JSON.stringify({}));
        } else {
            callback(new Error('File not found'));
        }
    },
    writeFile: (path, data, callback) => {
        callback(null);
    }
};

// Helper function to create a mock request
function createMockRequest(method, url, body) {
    return {
        method,
        url,
        headers: {},
        body,
        on: function(event, callback) {
            if (event === 'data') {
                callback(body);
            }
            if (event === 'end') {
                callback();
            }
        }
    };
}

// Helper function to create a mock response
function createMockResponse(callback) {
    const res = {
        statusCode: 200,
        headers: {},
        _data: '',
        setHeader: function(header, value) {
            this.headers[header] = value;
        },
        write: function(data) {
            this._data += data;
        },
        end: function(data) {
            if (data) this._data += data;
            callback(this);
        }
    };
    return res;
}

// Server-side functions from server.js

// Function to handle user login
function write_login_user(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const loginData = JSON.parse(body);

        // Read existing user data from the file
        fsMock.readFile('PublicResources/json/users.json', (err, data) => {
            if (err) {
                console.error("Error reading user data:", err);
                res.statusCode = 500;
                res.end(String(err));
                return;
            }

            try {
                const users = JSON.parse(data);

                // Check if the username exists and password matches
                if (users['obj_users'][loginData.username] && users['obj_users'][loginData.username].password === loginData.password) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true, username: loginData.username }));
                } else {
                    res.statusCode = 401;
                    res.end("Invalid username or password");
                }
            } catch (parseError) {
                console.error("Error parsing user data:", parseError);
                res.statusCode = 500;
                res.end(String(parseError));
            }
        });
    });
}

// Function to handle writing user data to a JSON file
function write_create_user(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const userData = JSON.parse(body);

        // Read existing data from the file
        fsMock.readFile('PublicResources/json/users.json', (err, data) => {
            let users = {}; // Initialize users object

            if (!err) {
                try {
                    users = JSON.parse(data);
                } catch (parseError) {
                    console.error("Error parsing existing user data:", parseError);
                }
            } else {
                // Handle file not found or empty
                console.error("Error reading existing user data:", err);
            }

            // Create obj_users object if not exists
            if (!users.hasOwnProperty('obj_users')) {
                users['obj_users'] = {};
            }

            // Check if the username already exists
            if (users['obj_users'].hasOwnProperty(userData.username)) {
                res.statusCode = 400;
                res.end("Username already exists");
                return;
            }

            // Append new user data
            users['obj_users'][userData.username] = {
                password: userData.password
            };

            // Write updated data back to the file
            fsMock.writeFile('PublicResources/json/users.json', JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end(String(err));
                } else {
                    console.log('User data appended to file');
                    fsMock.readFile('PublicResources/json/quest_log.json', (err, data) => {
                        let obj_questLog = {}; // Initialize questLog object
                        if (!err) {
                            try {
                                obj_questLog = JSON.parse(data);
                            } catch (parseError) {
                                console.error("Error parsing existing quests:", parseError);
                            }
                        } else {
                            // Handle file not found or empty
                            console.error("Error reading existing quest_log:", err);
                        }
                        obj_questLog[userData.username] = {
                            daily: {},
                            weekly: {},
                            monthly: {}
                        };

                        fsMock.writeFile('PublicResources/json/quest_log.json', JSON.stringify(obj_questLog, null, 2), (err) => {
                            if (err) {
                                console.error(err);
                                res.statusCode = 500;
                                res.end(String(err));
                            } else {
                                console.log('User added to quest_log');
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'text/plain');
                                res.end('User added to quest_log');
                            }
                        });

                    });
                }
            });

        });
    });
}

// Router function to process requests
function processReq(req, res) {
    if (req.url === '/login' && req.method === 'POST') {
        write_login_user(req, res);
    } else if (req.url === '/createUser' && req.method === 'POST') {
        write_create_user(req, res);
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
}

// Test the write_login_user function
function testWriteLoginUser() {
    console.log("Running testWriteLoginUser...");

    const req = createMockRequest('POST', '/login', JSON.stringify({
        username: 'testUser',
        password: 'testPass'
    }));
    const res = createMockResponse((res) => {
        // Assert
        if (res.statusCode !== 200) {
            console.error(`Expected status code 200, but got ${res.statusCode}`);
        }
        const responseData = JSON.parse(res._data);
        if (responseData.username !== 'testUser') {
            console.error(`Expected username to be testUser, but got ${responseData.username}`);
        }
        console.log("testWriteLoginUser completed.");
    });

    // Simulate request processing
    processReq(req, res);
}

// Test the write_create_user function
function testWriteCreateUser() {
    console.log("Running testWriteCreateUser...");

    const req = createMockRequest('POST', '/createUser', JSON.stringify({
        username: 'newUser',
        password: 'newPass'
    }));
    const res = createMockResponse((res) => {
        // Assert
        if (res.statusCode !== 200) {
            console.error(`Expected status code 200, but got ${res.statusCode}`);
        }
        if (res._data !== 'User added to quest_log') {
            console.error(`Expected response to be 'User added to quest_log', but got ${res._data}`);
        }
        console.log("testWriteCreateUser completed.");
    });

    // Simulate request processing
    processReq(req, res);
}

// Run the tests
testWriteLoginUser();
testWriteCreateUser();
