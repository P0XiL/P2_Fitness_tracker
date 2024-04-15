import http from 'http';
import fs from "fs";
import path from "path";

const hostname = '127.0.0.1';
const port = 3366;
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
            if (req.url === "/write_quest_json"){
                write_quest_json(req, res);
            } else {
                errorResponse(res, 404, "not found")
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



function write_quest_json(req, res){
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let obj_quest = JSON.parse(body);
        console.log(obj_quest);

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

            console.log(obj_questLog);

            const timespan = obj_quest.timespan;
            delete obj_quest.timespan;

            obj_questLog["assholeblaster69"][timespan][Object.keys(obj_quest)[0]] = obj_quest[Object.keys(obj_quest)[0]];


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


startServer();