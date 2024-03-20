

import {noRounds, rounds,isSpecialRound, isRoundString, getRoundID,makeRoundString, roundsText}
  from"./common.js";

  /* 
Ignore Double play at server?
remove form actions
add scripts and css from arrays.
encrypt
Image to toss (not sumbit)
test functions


*/
/* ************************************************************************************
 first a set of generic helper function to help make JSON HTTP calls using the fetch api 

************************************************************************************ */
function fetchTest(){
  fetch("scores.json")
    .then(response=> {return response.json()})
    .then(data=>{console.log(data);})
    .catch(reportError)
}
fetchTest();

function jsonParse(response){
  if(response.ok) 
     if(response.headers.get("Content-Type") === "application/json") 
       return response.json();
     else throw new Error("Wrong Content Type");   
 else 
    throw new Error("Non HTTP OK response");
}

function jsonFetch(url){
  return  fetch(url).then(jsonParse);
}


function jsonPost(url = '', data={}){
  const options={
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
    };
  return fetch(url,options).then(jsonParse);
}

/* report unhandled error */
function reportError(err){
  alert("Sorry!\n We encountered a problem that the app cannot (yet) handle: "+err);
}

/* ************************************************************************************
 Functions to handle the DRAGn DROP featurs of the application. 
 A dice roll is draggable to an "empty" scoretable dice field (drop zone) 
   ************************************************************************************ */

//to make a html element draggable, set the draggable attribute and register "dragstart" event handler 
//the browser calls dragstart when the user start dragging the element.
function enableDrag(elem){
  elem.addEventListener("dragstart",dragStart);
  elem.setAttribute("draggable","true");
}
function disableDrag(elem){
  elem.setAttribute("draggable","false");
  elem.removeEventListener("dragstart",dragStart);
}

//to allow the elem to be a drop zone, register two event handlers
//drop is called when the element is dropped
//dragover is called (continously) while a dragged element is hovering on the dropzone: used to check if the drop is allowed
function enableDropDice(elem){
  elem.addEventListener("drop",dropDice);
  elem.addEventListener("dragover",allowDrop); 
}
//remove the drop handlers from an element (not) used.
function disableDropDice(elem){
  elem.removeEventListener("drop",dropDice);
  elem.removeEventListener("dragover",allowDrop); 
}

//This function is called by the browser (continously) when moving a draggable element over a possible target element
//We use it to check if a drop is permitted on that target.
function allowDrop(event) {
  //To drop, we expect and empty drop zone
  //if it contains dice (here simply checked if it contains any element), we reject the drop
  
  //The drop zone may contain several nested html elements (that in general may allow drop)
  //so we locate the drop zone element by moving backwards in the tree untill "round_X_dices_id" is found 
  let t = event.target;
   while (t !== null && !isRoundString(t.id)) {
    t = t.parentNode;
  }
  //check that the dices drop field is empty
  if (t && t.childNodes.length > 0) {
    //console.log("REJECT");
    return false;
  }
  event.preventDefault(); //alow the drop.
}

//This function is called by the browser when the drag of a "draggable" element is started
//we save the id of the element being dragged in the dataTransfer container, such that the dragged element can be stored 
//at the drop zone. En element id is a string so the transferred type is "string" 
function dragStart(event) {
  //get the element id of the html element being dragged (eg. "dices_id")
  event.dataTransfer.setData("text",event.target.id);  
  event.dataTransfer.effectAllowed = 'move';
  //console.log("DRAG "+event.target.id);
}

//this function is called by the browser when the user drops an element onto a droppable element. 
//we locate the transferred element from the id attribute stored in the dataTransfer container, and disallows
//that the element can be dragged again (gamerule: you cannot remove the dice once placed in a Yatcy game)
//Then the (dices) element is placed, and the corresponing roundNo identified, and the resulting score is fetched from the server
function dropDice(event){
  let draggedElem_id=event.dataTransfer.getData("text");
  let draggedElem=document.getElementById(draggedElem_id);
  disableDrag(draggedElem);
  event.target.append(draggedElem);

  let roundNoString=event.target.id;
  let roundNo=getRoundID(roundNoString); // "round_5_dices_id" -> ["round", "5", "dices", "id"]
  playRound(roundNo);
}

//Sets of the dragn drop functionality: allow all non-special rounds of the score table (dices field) to become drop zones. 
function setupDragndrop(){
  for(let roundNo=0;roundNo< noRounds;roundNo++) {
    if(!isSpecialRound(roundNo)){ //round_x_dices_id
      let dicesDropElem=document.getElementById(makeRoundString(roundNo));
      enableDropDice(dicesDropElem);
    }
  }
} 

//Given a roll (an array of dice values), construct a draggable html span element containing an image for each dice.
//Images are by default draggable, we don't want that in this app.  
function createDicesElem(roll){ //array of dice values
  //<span id="dices_id"> 
  // <img src="img/6-dice.png" width="20" alt="dice 6" draggable="false"> .... </span> 
  let spanElem=document.createElement("SPAN");
  spanElem.setAttribute("id","dices_id");
  for(let dice of roll){
    let imgElem=document.createElement("IMG");
    imgElem.setAttribute("src",`img/${dice}-dice.png`);
    imgElem.setAttribute("width","20");     
    imgElem.setAttribute("alt",`dice ${dice}`);
    imgElem.setAttribute("draggable","false");
    spanElem.append(imgElem);
  }
  enableDrag(spanElem);
  return spanElem;
}

//Update the scoretable by the given (an array of) scores from the server 
//[{round:roundId,score:score},...]
function updateScoreTable(scores){
  for(let score of scores){
    let roundId=makeRoundString(score.round);
    //console.log("looking for "+roundId);

    let scoreElem=document.getElementById(roundId).nextElementSibling;
    scoreElem.innerText=String(score.score);
  }
}

//prepares the scoreBoard for a new game. Clears all scores and dice. 
function clearScoreBoard(){
  for(let roundNo=0;roundNo<noRounds;roundNo++){
    let scoreElem=document.getElementById(makeRoundString(roundNo));
    scoreElem.nextElementSibling.innerText=""; //clear the score cell
    removeAllChildren(scoreElem); //clear the dice cell
  }
  //clear any dices (not yet dragged to the score table) on the dices table
  let dicesElem=document.getElementById("dices_table");
  removeAllChildren(dicesElem);  
}
function removeAllChildren(elem){
  for(let e of elem.childNodes)
    elem.removeChild(e);
}


//Changes the player name in the score table header to 'playerName'
//demonstrate the use of querySelector feature. Often much more conveniently than giving every element an ID or class.
function setPlayerName(playerName){
   let playerNameElem= document.querySelector("#scoretable > thead > tr >th");
   playerNameElem.innerText=playerName;
} 

/* ************************************************************************************
  Application functions 
  ************************************************************************************ */

//extracts the form fields of the NewGame form and return them as a JS object  
function extractGameData(){
  let gameData={};
  gameData.name=document.getElementById("name_id").value;
  gameData.diceCount=parseInt(document.getElementById("diceCount_id").value);
  console.log("Extracted:");console.log(gameData);
  return gameData;
}

//gameID is a global variable object {gameID: id} containing the current ID of the game
//as received from the server: used to identify this game to the server that handles multiple games.  
let gameID; //an object containing a gameID value

//Need to compare if the current game matches that of 'gID'
function matchGameID(gID){
  if(gameID.gameID===gID.gameID) 
    return true;
  else {
    console.log("NON MATCHING GAMEID, Ignoring response");
    return false;
  }
}

//newGame is called when the user clicks on "new game" button. Starts a new game!
//It clears the current scoreboard, sends the form data (name,number of dice) to the server
//and receives a new gameID. It then enables the user to use the scoreTable to play. 
function newGame(event){
  event.preventDefault();
  document.getElementById("gameConfigSubmitBtn_id").disabled=true; //prevent double submission
  clearScoreBoard();
  let gameData=extractGameData();
   jsonPost("games",gameData).then(gameResp => {
     console.log(gameResp);
     gameID=gameResp; 
     setPlayerName(gameData.name);
     document.getElementById("gameConfigSubmitBtn_id").disabled=false; //re-enable submission
     document.getElementById("scoretable").classList.remove("greyed");
     enableRoll();
   }).catch(reportError);
}

//Fetch a new (random) set of dice fro the server, and place them on the dices table,
//ready for the user to drag to the desired game round
function doRoll(event){
  let localGameID=gameID;
  event.preventDefault();
  disableRoll();
   //jsonPost("games/"+localGameID.gameID+"/rolls",localGameID).then(gameResp => { //an array of dice [1,1,3,6,5];
   jsonPost("games/"+localGameID.gameID+"/rolls",{}).then(gameResp => { //an array of dice [1,1,3,6,5];
     console.log(gameResp);
     if(matchGameID(localGameID)){// check that the game has not been renewed while waiting for the server. 
       let dicesElem=createDicesElem(gameResp);
       document.getElementById("dices_table").append(dicesElem); 
     }
   }).catch(reportError);
}

//called when the user drops the dice on a given roundNo thereby playing the game of that round
//Ask the server to play that round, update the game state accordingly, and get the updated scores 
//if not game over, enable yeat another roll of the dices. 
function playRound(roundNo){
  let localGameID=gameID;
  //disableToss();//Needed?
  //jsonPost("games/"+localGameID.gameID+"/rolls/"+roundNo,{gameID:localGameID, roundNo:roundNo}).then(gameResp => {
  jsonPost("games/"+localGameID.gameID+"/rolls/"+roundNo,{}).then(gameResp => {
    console.log(gameResp);
    if(matchGameID(localGameID)){
      updateScoreTable(gameResp.scores);
      if(!gameResp.gameOver)
        enableRoll();
     }
   }).catch(reportError);
}


function enableRoll(){
  let rollElem=document.getElementById("gameControlSubmitBtn_id");
  rollElem.disabled=false;
}
function disableRoll(){
  let rollElem=document.getElementById("gameControlSubmitBtn_id");
  rollElem.disabled=true;
}
  
function setupEventhandlers(){
  let newGameFormElem=document.getElementById("gameConfigForm_id");
  newGameFormElem.addEventListener("submit",newGame);
  disableRoll();
  let rollFormElem=document.getElementById("gameControlForm_id");
  rollFormElem.addEventListener("submit",doRoll);
}

  

//MAIN 
clearScoreBoard();
setupDragndrop();
setupEventhandlers();

