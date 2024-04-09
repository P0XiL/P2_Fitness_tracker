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