import http from 'http';
import fs from "fs";
import path from "path";

const hostname = '127.0.0.1';
const port = 3364;
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

    switch(req.method) {
        case "GET":
            // Handle GET requests
            switch(queryPath) {
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
            if (queryPath === "/register_user") {
                const rootFileSystem=process.cwd();
                const users_filePath = path.join(rootFileSystem, publicResources, "json", "Users.json");
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    // Manually parse the request body
                    const formData = {};
                    body.split('&').forEach(keyValue => {
                        const [key, value] = keyValue.split('=');
                        formData[decodeURIComponent(key)] = decodeURIComponent(value);
                    });
        
                    const username = formData['username'];
                    const password = formData['password'];
                    const confirm_password = formData['confirm_password'];
                    
                    if (password !== confirm_password) {
                        errorResponse(res, 400, "Passwords do not match");
                    } else {
                        // Read existing user data from JSON file
                        fs.readFile(users_filePath, 'utf8', (err, data) => {
                            if (err && err.code !== 'ENOENT') {
                                console.error(err);
                                errorResponse(res, 500, String(err));
                            } else {
                                const users = JSON.parse(data || '{}'); // Parse existing user data or initialize empty object
        
                                // Add new user to the object
                                users.obj_users = users.obj_users || {}; // Ensure users property exists
                                users.obj_users[username] = { password };
        
                                // Write updated user data back to the JSON file
                                fs.writeFile(users_filePath, JSON.stringify(users, null, 2), 'utf8', err => {
                                    if (err) {
                                        console.error(err);
                                        errorResponse(res, 500, String(err));
                                    } else {
                                        console.log("User data written to Users.json");
                                        res.writeHead(302, { 'Location': '/html/LetsGo.html' }); 
                                        res.end();
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                errorResponse(res, 404, "Not found");
            }
            break;
        default:
            errorResponse(res, 405, "Method Not Allowed");
            break;
    }
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

startServer();