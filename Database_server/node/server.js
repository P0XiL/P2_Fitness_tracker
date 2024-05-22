import http from 'http';
import fs from "fs";
import path from "path";

const hostname = '127.0.0.1';
const port = 3360;
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
            switch (queryPath) {
                case "/":
                    fileResponse(res, "html/Letsgo.html");
                    break;
                case "/users_info.json": // Add this case for serving users_info.json
                    serveUsersInfo(res);
                    break;
                default:
                    fileResponse(res, req.url);
                    break;
            }
            break;
        case "POST":
            switch (queryPath) {
                case "/createUser":
                    write_create_user(req, res);
                    break;
                case "/login":
                    write_login_user(req, res);
                    break;
                case "/write_quest_json":
                    write_quest_json(req, res);
                    break;
                case "/change_amount":
                    change_amount(req, res);
                    break;
                case "/write_user_info_json":
                    write_user_info_json(req, res);
                    break;
                case "/addFriend":
                    addFriend(req, res);
                    break;
                case "/award_elo":
                    award_elo(req, res);
                    break;
                case "/write_survey_data_json":
                    write_survey_data_json(req, res);
                    break;
                case "/remove_elo":
                    remove_elo(req, res);
                    break;
                case "/deleteFriend":
                    deleteFriend(req, res);
                    break;
                default:
                    errorResponse(res, 404, "not found");
                    break;
            }
            break;
        default:
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 405;
            res.end('Method Not Allowed');
            break;
    }
}

// Function to serve the users_info.json file
function serveUsersInfo(res) {
    fs.readFile('PublicResources/json/users_info.json', (err, data) => {
        if (err) {
            console.error(err);
            errorResponse(res, 500, String(err));
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(data);
    });
}

function addFriend(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const friendData = JSON.parse(body);
        const friendUsername = friendData.friends;

        const username = friendData.username;

        // Read existing data from the file
        fs.readFile('PublicResources/json/users_info.json', (err, data) => {
            if (err) {
                console.error(err);
                errorResponse(res, 500, String(err));
                return;
            }

            let usersInfo = JSON.parse(data);

            const currentUser = username; // Assuming you have a user session

            // Check if the friend username exists in users_info and handle other conditions
            if (!usersInfo.users_info.hasOwnProperty(friendUsername)) {
                errorResponse(res, 400, "User not found");
                return;
            } else if (usersInfo.users_info[currentUser].friends.includes(friendUsername)) {
                errorResponse(res, 400, "User is already your friend");
                return;
            } else if (currentUser === friendUsername) {
                errorResponse(res, 400, "Thou may not add oneself as oneselves friend");
                return;
            } else {
                // Append friend to user's friend list
                if (!usersInfo.users_info[currentUser].friends) {
                    // Initialize friends array if it doesn't exist
                    usersInfo.users_info[currentUser].friends = [];
                }
                usersInfo.users_info[currentUser].friends.push(friendUsername);

                // Write updated data back to the file
                fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(usersInfo, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        errorResponse(res, 500, String(err));
                    } else {
                        console.log('Friend added successfully');
                        // Send a JSON response confirming the success of the operation
                        const jsonResponse = {
                            success: true,
                            message: 'Friend added successfully'
                        };
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(jsonResponse));
                    }
                });
            }
        });
    });
}

function deleteFriend(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const friendData = JSON.parse(body);
        const friendUsername = friendData.friend; // Assuming the client sends the friend's username

        const username = friendData.username; // Assuming the client sends the current user's username

        // Read existing data from the file
        fs.readFile('PublicResources/json/users_info.json', (err, data) => {
            if (err) {
                console.error(err);
                errorResponse(res, 500, String(err));
                return;
            }

            let usersInfo = JSON.parse(data);

            // Check if the user exists and if the friend is in the user's friend list
            if (usersInfo.users_info.hasOwnProperty(username) && usersInfo.users_info[username].friends.includes(friendUsername)) {
                // Remove the friend from the user's friend list
                const friendIndex = usersInfo.users_info[username].friends.indexOf(friendUsername);
                usersInfo.users_info[username].friends.splice(friendIndex, 1);

                // Write the updated data back to the file
                fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(usersInfo, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        errorResponse(res, 500, String(err));
                        return;
                    }

                    console.log('Friend deleted successfully');
                    // Send a response indicating success
                    const jsonResponse = {
                        success: true,
                        message: 'Friend deleted successfully'
                    };
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(jsonResponse));
                });
            } else {
                errorResponse(res, 400, "Friend not found in user's friend list");
            }
        });
    });
}



// Function to handle user login
function write_login_user(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const loginData = JSON.parse(body);

        // Read existing user data from the file
        fs.readFile('PublicResources/json/users.json', (err, data) => {
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
function write_create_user(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const userData = JSON.parse(body);

        // Read existing data from the file
        fs.readFile('PublicResources/json/users.json', (err, data) => {
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
            fs.writeFile('PublicResources/json/users.json', JSON.stringify(users, null, 2), (err) => {
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
                    name: "notAvailable",
                    age: 0,
                    height: 0,
                    weight: 0,
                    gender: "notAvailable",
                    fitnessGoal: "notAvailable",
                    activityLevel: "notAvailable",
                    surveyCompleted: false
                },
                mastery: {
                    run: {
                        rank: 1,
                        elo: 0
                    },
                    walk: {
                        rank: 1,
                        elo: 0
                    },
                    cycling: {
                        rank: 1,
                        elo: 0
                    },
                    squats: {
                        rank: 1,
                        elo: 0
                    },
                    lunges: {
                        rank: 1,
                        elo: 0
                    },
                    wallsit: {
                        rank: 1,
                        elo: 0
                    },
                    plank: {
                        rank: 1,
                        elo: 0
                    },
                    situps: {
                        rank: 1,
                        elo: 0
                    },
                    backextentions: {
                        rank: 1,
                        elo: 0
                    },
                    burpees: {
                        rank: 1,
                        elo: 0
                    },
                    crunches: {
                        rank: 1,
                        elo: 0
                    },
                    pushups: {
                        rank: 1,
                        elo: 0
                    },
                    dips: {
                        rank: 1,
                        elo: 0
                    },
                    armcircles: {
                        rank: 1,
                        elo: 0
                    }
                },
                hiddenRank: {
                    daily: 0,
                    weekly: 0,
                    monthly: 0
                },
                tier: {
                    daily: {
                        rank: 1,
                        elo: 0
                    },
                    weekly: {
                        rank: 1,
                        elo: 0
                    },
                    monthly: {
                        rank: 1,
                        elo: 0
                    }
                },
                preset: {
                    name: "balance",
                    conf: {
                        cardio: 2,
                        lowerbody: 2,
                        core: 2,
                        upperbody: 2
                    }
                },
                friends: []
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
        "gif": "image/gif",
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
            fs.writeFile('PublicResources/json/quest_log.json', JSON.stringify(obj_questLog, null, 2), (err) => {
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
            fs.writeFile('PublicResources/json/quest_log.json', JSON.stringify(obj_questLog, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    errorResponse(res, 500, String(err));
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Amount changed');
                }
            });
        });
    });
}


//Function the removes elo 
function remove_elo(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let obj_remove = JSON.parse(body);

        fs.readFile('PublicResources/json/users_info.json', (err, data) => {
            let obj_usersInfo = {}; // Initialize users_info object

            if (!err) {
                try {
                    obj_usersInfo = JSON.parse(data);
                } catch (parseError) {
                    console.error("Error parsing existing usersInfo:", parseError);
                }
            } else {
                // Handle file not found or empty
                console.error("Error reading existing usersinfo:", err);
            }
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

                obj_questLog[obj_remove.user][obj_remove.timespan][obj_remove.date].state = "failed";

                fs.writeFile('PublicResources/json/quest_log.json', JSON.stringify(obj_questLog, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        errorResponse(res, 500, String(err));
                    }
                });
            });

            const pathMatery = obj_usersInfo["users_info"][obj_remove.user]["mastery"][obj_remove.type];
            const pathTier = obj_usersInfo["users_info"][obj_remove.user]["tier"][obj_remove.timespan];
            //Remove mastery elo
            if (pathMatery["elo"] <= 25) {
                pathMatery["elo"] = 0
            } else {
                pathMatery["elo"] -= 25
            }

            //Remove tier elo
            if (pathTier["elo"] <= 25) {
                pathTier["elo"] = 0
            } else {
                pathTier["elo"] -= 25
            }

            // Write updated data back to the file
            fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(obj_usersInfo, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    errorResponse(res, 500, String(err));
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Rewarded Elo');
                }
            });
        });
    });
}

//Function that gives elo
function award_elo(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let obj_award = JSON.parse(body);

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

            obj_questLog[obj_award.user][obj_award.timespan][obj_award.date].state = "complete";



            // Write updated data back to the file
            fs.writeFile('PublicResources/json/quest_log.json', JSON.stringify(obj_questLog, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    errorResponse(res, 500, String(err));
                }
            });
        });
        fs.readFile('PublicResources/json/users_info.json', (err, data) => {
            let obj_usersInfo = {}; // Initialize users_info object

            if (!err) {
                try {
                    obj_usersInfo = JSON.parse(data);
                } catch (parseError) {
                    console.error("Error parsing existing usersInfo:", parseError);
                }
            } else {
                // Handle file not found or empty
                console.error("Error reading existing usersinfo:", err);
            }
            let award = 0;
            if (obj_award.difficulty == -3) {
                award = 25;
            }
            else if (obj_award.difficulty == 0) {
                award = 50;
            }
            else if (obj_award.difficulty == 3) {
                award = 100;
            }
            else {
                console.error("Error, could not determine difficulty of completed task")
            }
            const pathMatery = obj_usersInfo["users_info"][obj_award.user]["mastery"][obj_award.type];
            pathMatery["elo"] += award;
            if (pathMatery["elo"] >= 500) {
                pathMatery["rank"] += 3;
                pathMatery["elo"] -= 500;
            }
            award = (Math.log10(parseInt(pathMatery["rank"])) + 1) * award;
            console.log(pathMatery["rank"] + "=" + award, Math.log10(parseInt(pathMatery["rank"])));
            const pathTier = obj_usersInfo["users_info"][obj_award.user]["tier"][obj_award.timespan];
            pathTier["elo"] += award;

            switch (obj_award.timespan) {
                case "daily":
                    while (pathTier["elo"] >= 100) {
                        pathTier["rank"] += 3;
                        pathTier["elo"] -= 100;
                    }
                    break;
                case "weekly":
                    while (pathTier["elo"] >= 40) {
                        pathTier["rank"] += 3;
                        pathTier["elo"] -= 40;
                    }
                    break;
                case "monthly":
                    while (pathTier["elo"] >= 20) {
                        pathTier["rank"] += 3;
                        pathTier["elo"] -= 20;
                    }
                    break;

                default:
                    console.error("Could not determine timespan")
                    break;
            }

            // Write updated data back to the file
            fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(obj_usersInfo, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    errorResponse(res, 500, String(err));
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Rewarded Elo');
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

            let existingData = JSON.parse(data);
            existingData.users_info[user_info.username] = user_info;

            // Write updated data back to the file
            fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(existingData, null, 2), (err) => {
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
                    res.end(JSON.stringify(jsonResponse, null, 2));
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

            // Check if the username exists in users_info before updating
            if (existingData.users_info.hasOwnProperty(surveyData.userid)) {
                existingData.users_info[surveyData.userid].health = {
                    name: surveyData.name,
                    age: surveyData.age,
                    height: surveyData.height,
                    weight: surveyData.weight,
                    gender: surveyData.gender,
                    fitnessGoal: surveyData.fitnessGoal,
                    activityLevel: surveyData.activityLevel,
                    surveyCompleted: true
                };
            } else {
                // Handle the case where the username doesn't exist
                console.error('User info not found for user ID:', surveyData.userid);
                // Return an error response or take appropriate action
            }

            // Write updated data back to the file
            fs.writeFile('PublicResources/json/users_info.json', JSON.stringify(existingData, null, 2), (err) => {
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
