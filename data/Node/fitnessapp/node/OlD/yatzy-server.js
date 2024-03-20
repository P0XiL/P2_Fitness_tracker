/*
const http = require('http');
const fs=require("fs");
const path=require("path");
const url=require("url");
*/

//THIS APP USES ES6 MODULES  
import http from 'http';
import fs from "fs";
import path  from "path";
import url from "url";
import qs from "querystring";

//const { SSL_OP_NETSCAPE_CA_DN_BUG } = require('constants');
//const { setupMaster } = require('cluster');
const hostname = '127.0.0.1';
const port = 3000;

//const serverName="http://localhost:3000";

/* *****************************************************************
  DISCLAIMER: This code is developed to support education and demo 
  purposes and certain simplifications have been made to keep the code
  comphrensible.
  ****************************************************************** */


/* ***************************************************************************  
  First a number of generic helper functions to serve basic files and documents 
 ***************************************************************************** */ 


/* ***                 Setup Serving of files ***                  */ 

const publicResources="node/PublicResources/";
//secture file system access as described on 
//https://nodejs.org/en/knowledge/file-system/security/introduction/
const rootFileSystem=process.cwd();
function securePath(userPath){
  if (userPath.indexOf('\0') !== -1) {
    // could also test for illegal chars: if (!/^[a-z0-9]+$/.test(filename)) {return undefined;}
    return undefined;

  }
  userPath= publicResources+userPath;

  let p= path.join(rootFileSystem,path.normalize(userPath)); 
  //console.log("The path is:"+p);
  return p;
}


/* send contents as file as response */
function fileResponse(res, filename){
  const sPath=securePath(filename);
  console.log("Reading:"+sPath);
  fs.readFile(sPath, (err, data) => {
    if (err) {
      console.error(err);
      errorResponse(res,404,String(err));
    }else {
      res.statusCode = 200;
      res.setHeader('Content-Type', guessMimeType(filename));
      res.write(data);
      res.end('\n');
    }
  })
}

//A helper function that converts filename suffix to the corresponding HTTP content type
//better alternative: use require('mmmagic') library
function guessMimeType(fileName){
  const fileExtension=fileName.split('.').pop().toLowerCase();
  console.log(fileExtension);
  const ext2Mime ={ //Aught to check with IANA spec
    "txt": "text/txt",
    "html": "text/html",
    "ico": "image/ico", // CHECK x-icon vs image/vnd.microsoft.icon
    "js": "text/javascript",
    "mjs": "text/javascript",
    "json": "application/json", 
    "css": 'text/css',
    "png": 'image/png',
    "jpg": 'image/jpeg',
    "wav": 'audio/wav',
    "mp3": 'audio/mpeg',
    "svg": 'image/svg+xml',
    "pdf": 'application/pdf',
    "doc": 'application/msword',
    "docx": 'application/msword'
   };
    //incomplete
  return (ext2Mime[fileExtension]||"text/plain");
}

/* Heler functions to retrieve request objects and send response objects    */  

/* send a response with htmlString as html page */
function htmlResponse(res, htmlString){
  res.statusCode = 200;
  res.setHeader('Content-Type', "text/html");
  res.write(htmlString);
  res.end('\n');
}

/* send a response with a given HTTP error code, and reason string */ 
function errorResponse(res, code, reason){
  res.statusCode=code;
  res.setHeader('Content-Type', 'text/txt');
  res.write(reason);
  res.end("\n");
}
/* send 'obj' object as JSON as response */
function jsonResponse(res,obj){
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(obj));
  res.end('\n');
}

/* As the body of a POST may be long the HTTP modules streams chunks of data
   that must first be collected and appended before the data can be operated on. 
   This function collects the body and returns a promise for the body data
*/
/*
if (body.length > 1e6) { 
  // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
  request.connection.destroy();
}
*/
function collectPostBody(req){
  //the "executor" function
 function collectPostBodyExecutor(resolve,reject){
    let bodyData = [];
    req.on('data', (chunk) => {
      bodyData.push(chunk);
    }).on('end', () => {
    bodyData = Buffer.concat(bodyData).toString();
    console.log(bodyData);
    resolve(bodyData); 
    });
    //Exceptions raised will reject the promise
  }
  return new Promise(collectPostBodyExecutor);
}

/* extract the enclosed JSON object in body of a POST to JavaScript Object */ 
/* Aught also to check that Content-Type is application/json before parsing*/;
function extractJSON(req){
  return collectPostBody(req).then(body=> {
    let x= JSON.parse(body);
    console.log(x);
    return x;
  });
}
/* extract the enclosed forms data in the pody of POST */
/* Aught also chgeck that Content-Type is application/x-www-form-urlencoded before parsing*/

function extractForm(req){
  return collectPostBody(req).then(body=> {
    const data = qs.parse(body);
    console.log(data);
    return data;
  });
}



/* ****************************************************************************
 * Application code for the step tracker application 
 ***************************************************************************** */
import {yatzyHomePage,newYatzyGame,doRoll,playRound} from "./app.js";

//constants for validating input from the network client
const maxDiceCount=20;
const minDiceCount=5;
const minNameLength=1;
const maxNameLength=30;

function validateYatzyConfigData(gameFormData){
  let playerName="";
  let playerNameLen=playerName.length;
  let diceCount=0;

  try{
  console.log(gameFormData);
    playerName=gameFormData.name;
    playerNameLen=playerName.length;
    diceCount=parseInt(gameFormData.diceCount);
    console.log(playerNameLen); console.log(diceCount);
  } catch{throw (new Error("Validation Error"))};//ensure that data contains the right fields
   //ensure that the fields contain appropriate values
  if((playerNameLen>=minNameLength) && (playerNameLen<=maxNameLength) &&
     (diceCount >= minDiceCount) && (diceCount <=maxDiceCount) ){
      //discard other fields from incomming object
    let gameData={name: playerName, diceCount: diceCount};
    return gameData;
  } 
  else throw(new Error("Validation Error"));
}
function validateGameID(gameIDInput){
  let gameID=parseInt(gameIDInput.gameID);
  //decrypt, check range
  return {gameID: gameID};
}

//check that the gameID exist
function validateYatzyRoundData(roundFormData){
  console.log("validating"); console.log(roundFormData);
  let gameID;
  let roundNo;
  try{
    gameID=validateGameID(roundFormData.gameID).gameID;
    roundNo=parseInt(roundFormData.roundNo);
  }
  catch{throw (new Error("Validation Error"))};//ensure that data contains the right fields}
  if(roundNo>=0 && roundNo<18) //call game controller
     return {gameID:gameID,roundNo: roundNo};
  else throw(new Error("Validation Error"));
}
function reportError(res,error){
  if(error.message=="Validation Error"){
    return errorResponse(res,400,error.message);
  }
  else {
    console.log("Internal Error: " +error);
    return errorResponse(res,500,"");
  }
}
/* *********************************************************************
   Setup HTTP server and route handling 
   ******************************************************************** */


const server = http.createServer(requestHandler);
function requestHandler(req,res){
  try{
   processReq(req,res);
  }catch(e){
    console.log("Internal Error: " +e);
   errorResponse(res,500,"");
  }
}

function processReq(req,res){
 
  console.log("GOT: " + req.method + " " +req.url);
  //https://www.w3schools.com/nodejs/nodejs_url.asp

  switch(req.method){
    case "POST": 
      let query=url.parse(req.url);
      let queryPath=decodeURI(query.path); // Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string
      let pathElements=queryPath.split("/"); 
      console.log(pathElements[1]);
      switch(pathElements[1]){
        case "newGame":
          extractJSON(req)
          .then(gameData => validateYatzyConfigData(gameData))
          .then(gameData => jsonResponse(res,newYatzyGame(gameData)))
          .catch(err=>reportError(res,err));
          break;
        case "doRoll":
          extractJSON(req)
          .then(gameID => validateGameID(gameID))
          .then(gameID => jsonResponse(res,doRoll(gameID)))
          .catch(err=>reportError(res,err));
        break;

        case "playRound":
          extractJSON(req)
          .then(roundData => validateYatzyRoundData(roundData))
          .catch(error=>{  //We assume that an exception until here is caused by a validation error!
            throw new Error("Validation Error"); //bad client request 
           })
           .then(roundData => jsonResponse(res,playRound(roundData)));
          break; 
        case "stepcounts": 
          extractJSON(req)
          .then(stepCountFormData=> validateStepCountForm(stepCountFormData))
          .catch(error=>{  //We assume that an exception until here is caused by a validation error!
            throw new Error("Validation Error"); //bad client request 
           })
          .then(stepCountData=>recordSteps(stepCountData))
          .then(stepCountStatus=>jsonResponse(res,stepCountStatus)) //Could also return empty object {}
          .catch(error=>{
            if(error.message=="Validation Error"){
              return errorResponse(res,400,error.message);
            }
            else {
              console.log("Internal Error: " +error);
              return errorResponse(res,500,"");
            }
          }
          );
      break; 
      default: 
         console.error("Resource doesn't exist");
         errorResponse(res, 404, "No such resource"); 
    } break; //END POST URL
    case "GET":{

      let query=url.parse(req.url);
      let queryPath=decodeURI(query.path); // Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string
      let pathElements=queryPath.split("/"); 
      console.log(pathElements);

      switch(pathElements[1]){  //index 0 contains string before first "/" (which is empty) 
        case "":                // for the root document return the main yatzy page  
           return htmlResponse(res,yatzyHomePage());
          break; 
           /*
        case "stepcounts":{
            res.setHeader('Cache-Control', 'no-store');
            return jsonResponse(res,{scoreTable: ""} );
        }
        */
        break;
        default: //for anything else we assume it is a file to be served
          return fileResponse(res, req.url);
          break;
       }
     }
     break;//END switch GET URL
    default:
      errorResponse(res, 404, "No such resource"); 
  } //end switch method
}



/* start the server */
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  fs.writeFileSync('message.txt', `Server running at http://${hostname}:${port}/`);
});


