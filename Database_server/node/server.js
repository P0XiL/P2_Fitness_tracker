import http from 'http';
import fs from "fs";
import path from "path";

const hostname = '127.0.0.1';
const port = 3369; 
const publicResources = "PublicResources/";

const server = http.createServer((req, res) => {
    try {
        processReq(req, res);
    } catch (e) {
        console.log("Internal Error!!: " + e);
        errorResponse(res, 500, "");
    }
});

function startServer() {
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

function processReq(req, res) {
    const baseURL = 'http://' + req.headers.host + '/';
    const url = new URL(req.url, baseURL);
    const searchParams = new URLSearchParams(url.search);
    const queryPath = decodeURIComponent(url.pathname);

    switch (req.method) {
        case "GET":
            // Handle GET requests
            switch (queryPath) {
                case "/":
                    fileResponse(res, "html/Letsgo.html");
                    break;
                // Add more cases for different routes if needed
                default:
                    fileResponse(res, req.url);
                    break;
            }
            break;
        case "POST":
            // Handle POST requests
            // Add your POST request handling logic here
            if (queryPath === "/createUser") {
                // Handle the POST request to write user data to a file
                createUser(req, res);
            } 
            else if (queryPath === "/login") {
                loginUser(req, res);
            }
            else if (queryPath === "/write_quest_json") {
                write_quest_json(req, res);
            } else if (queryPath === "/change_amount") { 
                // Add new route for changing quest amount
                change_amount(req, res);
            } else if (queryPath === "/write_user_info_json") { 
                // Add new route for writing user info
                write_user_info_json(req, res);
            } else {
                errorResponse(res, 404, "not found")
            }
            break;
        default:
            errorResponse(res, 405, "Method Not Allowed");
            break;
    }
}

// Function to handle user login
function loginUser(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const loginData = JSON.parse(body);

        // Read existing user data from the file
        fs.readFile('PublicResources/json/Users.json', (err, data) => {
            if (err) {
                console.error("Error reading user data:", err);
                errorResponse(res, 500, String(err));
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
                    errorResponse(res, 401, "Invalid username or password");
                }
            } catch (parseError) {
                console.error("Error parsing user data:", parseError);
                errorResponse(res, 500, String(parseError));
            }
        });
    });
}

// Function to handle writing user data to a JSON file
function createUser(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const userData = JSON.parse(body);

        // Read existing data from the file
        fs.readFile('PublicResources/json/Users.json', (err, data) => {
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
                errorResponse(res, 400, "Username already exists");
                return;
            }

            // Append new user data
            users['obj_users'][userData.username] = {
                password: userData.password
            };

            // Write updated data back to the file
            fs.writeFile('PublicResources/json/Users.json', JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    errorResponse(res, 500, String(err));
                } else {
                    console.log('User data appended to file');
                    fs.readFile('PublicResources/json/quest_log.json', (err, data) => {
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
                    
                        fs.writeFile('PublicResources/json/quest_log.json', JSON.stringify(obj_questLog, null, 2), (err) => {
                            if (err) {
                                console.error(err);
                                errorResponse(res, 500, String(err));
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
        addUserToUsers_info(userData.username);
    });
}

function addUserToUsers_info(username) {
    // Read existing data from the file
    fs.readFile('PublicResources/json/users_info.json', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        let existingData = JSON.parse(data);

        // Check if the username exists in the users_info object
        if (!existingData.users_info.hasOwnProperty(username)) {
            // Create the new user object
            let newUser = {
                username: username,
                health: {
                    height: 0,
                    weight: 0
                },
                mastery: {},
                hiddenRank: {},
                tier: {},
                preset: {}
            };

            // Add the new user to the users_info object
            existingData.users_info[username] = newUser;

            // Write updated data back to the file with indentation
            fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('New user info written to file');
                }
            });
        } else {
            // Log a message indicating that the username already exists
            console.log(`User with username '${username}' already exists`);
        }
    });
}






function errorResponse(res, code, reason) {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/txt');
    res.write(reason);
    res.end("\n");
}

function fileResponse(res, filename) {
    const sPath = securePath(filename);
    console.log("Reading:" + sPath);
    fs.readFile(sPath, (err, data) => {
        if (err) {
            console.error(err);
            errorResponse(res, 404, String(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', guessMimeType(filename));
            res.write(data);
            res.end('\n');
        }
    })
}

function securePath(userPath) {
    if (userPath.indexOf('\0') !== -1) {
        return undefined;
    }
    userPath = path.normalize(userPath).replace(/^(\.\.(\/|\\|$))+/, '');
    userPath = publicResources + userPath;
    return path.join(process.cwd(), path.normalize(userPath));
}

function guessMimeType(fileName) {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const ext2Mime = {
        "txt": "text/plain",
        "html": "text/html",
        "ico": "image/vnd.microsoft.icon",
        "js": "text/javascript",
        "json": "application/json",
        "css": "text/css",
        "png": "image/png",
        "jpg": "image/jpeg",
        "wav": "audio/wav",
        "mp3": "audio/mpeg",
        "svg": "image/svg+xml",
        "pdf": "application/pdf",
        "doc": "application/msword",
        "docx": "application/msword"
    };
    return ext2Mime[fileExtension] || undefined;
}

//Function for adding a quest to the quest_log json file
function write_quest_json(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let obj_quest = JSON.parse(body);

        // Read existing data from the file
        fs.readFile('PublicResources/json/quest_log.json', (err, data) => {
            let obj_questLog = {}; // Initialize quest_log object

            if (!err) {
                try {
                    obj_questLog = JSON.parse(data);
                } catch (parseError) {
                    console.error("Error parsing existing quest_log:", parseError);
                }
            } else {
                // Handle file not found or empty
                console.error("Error reading existing quest_log:", err);
            }
            const timespan = obj_quest.timespan;
            delete obj_quest.timespan;
            const user = obj_quest.userID;
            delete obj_quest.userID;
            obj_questLog[user][timespan][Object.keys(obj_quest)[0]] = obj_quest[Object.keys(obj_quest)[0]];
           
            // Write updated data back to the file
            fs.writeFile('PublicResources/json/quest_log.json', JSON.stringify(obj_questLog), (err) => {
                if (err) {
                    console.error(err);
                    errorResponse(res, 500, String(err));
                } else {
                    console.log('Added new ' + timespan + ' Quest');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('User data appended to file');
                }
            });
        });
    });
}

//Function that changes amount of completion
function change_amount(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let obj_amountInfo = JSON.parse(body);

        // Read existing data from the file
        fs.readFile('PublicResources/json/quest_log.json', (err, data) => {
            let obj_questLog = {}; // Initialize quest_log object

            if (!err) {
                try {
                    obj_questLog = JSON.parse(data);
                } catch (parseError) {
                    console.error("Error parsing existing quest_log:", parseError);
                }
            } else {
                // Handle file not found or empty
                console.error("Error reading existing quest_log:", err);
            }

            const quest = obj_questLog[obj_amountInfo.user][obj_amountInfo.timespan][obj_amountInfo.date];
            if (obj_amountInfo["mode"] === "add") {
                quest.amount += obj_amountInfo.amount;
            } else {
                quest.amount -= obj_amountInfo.amount;
                if (quest.amount < 0) {
                    quest.amount = 0;
                }
            }


            // Write updated data back to the file
            fs.writeFile('PublicResources/json/quest_log.json', JSON.stringify(obj_questLog), (err) => {
                if (err) {
                    console.error(err);
                    errorResponse(res, 500, String(err));
                } else {
                    console.log('User data appended to file');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('User data appended to file');
                }
            });
        });
    });
}






function write_user_info_json(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let user_info = JSON.parse(body);

        // Read existing data from the file
        fs.readFile('PublicResources/json/users_info.json', (err, data) => {
            if (err) {
                console.error(err);
                errorResponse(res, 500, String(err));
                return;
            }
            let obj_survey = {};

            let existingData = JSON.parse(data);
            existingData.users_info[user_info.username].preset = user_info.preset;

            // Write updated data back to the file
            fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(existingData), (err) => {
                if (err) {
                    console.error(err);
                    errorResponse(res, 500, String(err));
                } else {
                    console.log('User info written to file');
                    // Send a JSON response confirming the success of the operation
                    const jsonResponse = {
                        success: true,
                        message: 'User info updated successfully'
                    };
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(jsonResponse));
                }
            });
        });
    });
}

function write_user_preferences_json(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let user_info = JSON.parse(body);

        // Read existing data from the file
        fs.readFile('PublicResources/json/users_info.json', (err, data) => {
            if (err) {
                console.error(err);
                errorResponse(res, 500, String(err));
                return;
            }

            let existingData = JSON.parse(data);
            existingData.users_info[user_info.username].preset = user_info.preset;

            // Write updated data back to the file
            fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(existingData), (err) => {
                if (err) {
                    console.error(err);
                    errorResponse(res, 500, String(err));
                } else {
                    console.log('User info written to file');
                    // Send a JSON response confirming the success of the operation
                    const jsonResponse = {
                        success: true,
                        message: 'User info updated successfully'
                    };
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(jsonResponse));
                }
            });
        });
    });
}
    function write_survey_data_json(req, res) {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let surveyData = JSON.parse(body);
            console.log('Received survey data:', surveyData); // Log received survey data
    
            // Read existing data from the file
            fs.readFile('PublicResources/json/users_info.json', (err, data) => {
                if (err) {
                    console.error('Error reading existing data:', err);
                    errorResponse(res, 500, String(err));
                    return;
                }
    
                let existingData = JSON.parse(data);
                console.log('Existing data:', existingData); // Log existing data
    
                // Ensure users_info object exists
                existingData.users_info = existingData.users_info || {};

                // Fetch idkey from users_info or set a default value if not available
                const idkey = existingData.users_info && existingData.users_info.idkey ? existingData.users_info.idkey : "defaultIdkey";

                // Ensure the idkey exists within users_info
                existingData.users_info[idkey] = existingData.users_info[idkey] || {};

                // Add the surveyData to the specified idkey
                 existingData.users_info[idkey].surveyData = surveyData;
    
                // Write updated data back to the file
                fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(existingData), (err) => {
                    if (err) {
                        console.error('Error writing data:', err);
                        errorResponse(res, 500, String(err));
                    } else {
                        console.log('Survey data written to file');
                        // Send a JSON response confirming the success of the operation
                        const jsonResponse = {
                            success: true,
                            message: 'Survey data saved successfully'
                        };
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(jsonResponse));
                    }
                });
            });
        });
    }
startServer();
