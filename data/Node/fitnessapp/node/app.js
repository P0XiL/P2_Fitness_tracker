//We use EC6 modules!

import {noRounds,rounds,isSpecialRound,makeRoundString} from "./PublicResources/js/common.js";
import {ScoreTable,roll} from "./yatzy-game2.js";

import {extractJSON, fileResponse, htmlResponse,extractForm,jsonResponse,errorResponse,reportError,startServer} from "./server.js";
const ValidationError="Validation Error";
const NoResourceError="No Such Resource";
export {ValidationError, NoResourceError, processReq};

startServer();


function yatzyHomePage(){
    let page=yatzyController.emptyGame.printHTMLPage();
    return page; 
  }
  
function newYatzyGame(gameData){
    let game=yatzyController.newYatzyGame(gameData);
    //gameID should be hashed
    game.start(); 
    return {gameID: game.gameID};
  }
  function doRoll(gameID){
    console.log("ROLL"+gameID.gameID);
    let game=yatzyController.getGame(gameID.gameID);
    let r=game.diceRoll();
    console.log(r);
    return r;
  }
 function playRound(roundData){
    let gameID=roundData.gameID;
    let roundNo=roundData.roundNo;
    let game=yatzyController.getGame(gameID);
    console.log("Playing "+gameID+":"+roundNo);
    let scores=game.playRound(roundNo);
    console.log(scores);
    return scores;
}

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
  } catch{throw (new Error(ValidationError))}//ensure that data contains the right fields
   //ensure that the fields contain appropriate values
  if((playerNameLen>=minNameLength) && (playerNameLen<=maxNameLength) &&
     (diceCount >= minDiceCount) && (diceCount <=maxDiceCount) ){
      //discard other fields from incomming object
    let gameData={name: playerName, diceCount: diceCount};
    return gameData;
  } 
  else throw(new Error(ValidationError));
}

function validateGameData(gameIDInput,extraData){
  //extraData not used in this APP
  let gameID=parseInt(gameIDInput);
  //decrypt, check range
  //does game exist?
  if(!yatzyController.getGame(gameID)) throw (new Error(ValidationError))
  return {gameID: gameID};
}
//check that the gameID exist
function validateYatzyRoundData(roundData,extraData){
   //extraData not used in this APP
  console.log("validating"); console.log(roundData);
  let gameID;
  let roundNo;
  try{
    gameID=validateGameData(roundData.gameID).gameID;
    roundNo=parseInt(roundData.roundNo);
  }
  catch{throw (new Error(ValidationError))} //ensure that data contains the right fields}
  if(roundNo>=0 && roundNo<18) //call game controller
     return {gameID:gameID,roundNo: roundNo};
  else throw(new Error(ValidationError));
}


function processReq(req,res){
 
  console.log("GOT: " + req.method + " " +req.url);
  
  let baseURL = 'http://' + req.headers.host + '/';    //https://github.com/nodejs/node/issues/12682
  let url=new URL(req.url,baseURL);
  let searchParms=new URLSearchParams(url.search);
  let queryPath=decodeURIComponent(url.pathname); //Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string

  switch(req.method){

    case "POST": {
      let pathElements=queryPath.split("/"); 
      console.log(pathElements.length); console.log(pathElements);

      switch(pathElements[1]){
        case "games": {
         if(pathElements.length===2) {
           //POST to "games": create a new game and return GID
           console.log("NEW GAME");
           extractJSON(req)
           .then(gameData => validateYatzyConfigData(gameData))
           .then(gameData => jsonResponse(res,newYatzyGame(gameData)))
           .catch(err=>reportError(res,err));
         } else
         if((pathElements.length===4)&&(pathElements[3]==="rolls")) {
           // POST to "games/{gid}/rolls": create new dice roll
           console.log("NEW DICE ROLL");
           extractJSON(req)
           .then(gameData => validateGameData(pathElements[2],gameData))
           .then(gameID => jsonResponse(res,doRoll(gameID)))
           .catch(err=>reportError(res,err));
         } else
         if((pathElements.length===5) && (pathElements[3]==="rolls")){
           // POST to "games/{gid}/rolls/{roundID}"": place dice roll
           console.log("PLAYROUND");
           let roundData={gameID: pathElements[2], roundNo:pathElements[4]}
           extractJSON(req)
           .then(extraRoundData => validateYatzyRoundData(roundData,extraRoundData))
           .then(roundData => jsonResponse(res,playRound(roundData)))
           .catch(err => reportError(res,err));
         } else 
          reportError(res, NoResourceError); 
        }
      break;

      default: 
         console.error("Resource doesn't exist");
         reportError(res, NoResourceError); 
      }
    } break; //END POST URL
    case "GET":{
      let pathElements=queryPath.split("/"); 
      console.log(pathElements);

      switch(pathElements[1]){  //index 0 contains string before first "/" (which is empty) 
        case "":                // for the root document return the main yatzy page  
           return htmlResponse(res,yatzyHomePage());
          break; 

        default: //for anything else we assume it is a file to be served
        return fileResponse(res, queryPath);
        //return fileResponse(res, req.url);
          break;
       }
     }
     break;//END switch GET URL
    default:
      reportError(res, NoResourceError); 
  } //end switch method
}


/*
A set of general functions to generate a basic HTML page and table
*/
function printTableBodyHTML(attr,code){
  return `<tbody${attr}>\n ${code} </tbody>\n`;
}
  
function printTableRowHTML(attr,code){
  return `<tr ${attr}> ${code} </tr>\n`;
}
  
function printTableCellHTML(attr,code){
  return `<td ${attr}> ${code} </td>\n`;
}

function printUrl(attr,text,link){
  let anchor=`<a href="${link}" ${attr}>${text}</a>`;
  return anchor; 
}

//The page needs a HTML header with a suitable title
function printHTMLHdr(title,css="",script=""){
  let str=`
  <!DOCTYPE html>
  <html lang="da">
  <head>
    <title>${title}</title>
    <meta charset="utf-8">
    ${css===""?"":"<link rel=\"stylesheet\" href=\""+css+"\">\n"}
    ${script===""?"":"<script  type=\"module\" defer src=\""+script+"\"></script>\n"}
  </head>\n`;
  return str;
}

//The page needs a body, with html contents given in body parameter
function printHTMLBody(body){
let str=`
  <body>
  ${body}
   </body>
</html>`;
return str;
}



let yatzyController={
    games: [],
    emptyGame: new YatzyGame(-1,"Player",5),
    getGame:function(gameID){return this.games[gameID];},
    newYatzyGame: function (gameData){
      let gameID=this.games.length;
      let game=new YatzyGame(gameID,gameData.name, gameData.diceCount);
      this.games[gameID]=game;
      return game;
    }
}

//constructor function to create YatzyGame objects that keep the state of a game
//gameID the unique ID for this game (used by clients)
//name: name of player
//diceCount: number of dice used in the game
function YatzyGame(gameID,name,diceCount){
  this.gameID=gameID;
  this.name=name;
  this.diceCount=diceCount;
  this.round=0;
  this.lastRoll=[];
  this.scoreTable=new ScoreTable(diceCount);
  this.gameOn=false;
  this.gameOver=function(){return (this.round>noRounds)}; 
  this.start=function(){this.gameOn=true;};

  this.diceRoll=function(){
    this.lastRoll=roll(this.diceCount);
    console.log(this.lastRoll);
    return this.lastRoll;
  }

  this.playRound=function(round){
     this.scoreTable.playGame(round, this.lastRoll);
     console.log(this.scoreTable.getScore(round));
     let scoreUpdate={
       scores: [
       {round: round, score: this.scoreTable.getScore(round).score},
       {round: rounds.sum, score: this.scoreTable.getScore(rounds.sum).score},
       {round: rounds.bonus, score: this.scoreTable.getScore(rounds.bonus).score},
       {round: rounds.total, score: this.scoreTable.getScore(rounds.total).score}
       ],
       gameOver:this.scoreTable.gameOver()
     };
     console.log(scoreUpdate);
     return scoreUpdate;
  };

  this.printScoreTableHdrHTML= function(){
    //Print table header and caption
    let res="";
    res+="<caption> Yatzy Scores </caption>\n";
    res+="<thead><tr> <th colspan=\"3\"> "+this.name +" </th></tr>\n";
    res+="<tr> <th>Round Name </th> <th> Dice </th> <th>Score</th></tr>\n";
    res+="</thead> \n";
    //print the table body, one row at a time
    return res;
  };
  
  
  //generates the HTML code for the play scores table, assumed to be complete.
  this.printScoresHTML= function(){
    //Print table header and caption
    let res=`<table id="scoretable" ${(this.gameOn)?"":"class=\"greyed\""}> \n`;
    res+=this.printScoreTableHdrHTML();
    let rows="";
  
    for(let [roundNo,roundEntry] of this.scoreTable.playScore.entries()) {
      let row="";
      //and one column at a time, first "round name"
      let clmn1 =printTableCellHTML("class=\"left-text\"", roundEntry.roundName);
    
      let c2="";   //contents cell2
    
      //then the actual dice roll, if any (special rounds do not have a roll)
      if(!isSpecialRound(roundNo)){
        let imgs="";
        for(let d=0;d<roundEntry.diceRoll.length;d++){
           imgs+=`<img src="img/${roundEntry.diceRoll[d]}-dice.png" width="20" height="20" alt="dice ${roundEntry.diceRoll[d]}" >`;
        }
        if(roundEntry.diceRoll.length>0);
           c2+="<span>"+imgs+ "</span>";
      }
      let clmn2 =printTableCellHTML(`id="round_${roundNo}_dices_id"`, c2);
     
      //finally the score column
      let clmn3 = printTableCellHTML(`class="right-text"`, roundEntry.score);
  
      if(isSpecialRound(roundNo))
        row+=printTableRowHTML(`class="row-fill"`, clmn1+clmn2+clmn3);
      else
        row+=printTableRowHTML("", clmn1+clmn2+clmn3);
  
      rows+=row;
    }
    res+=printTableBodyHTML("",rows);
    res+="</table>" 
    console.log(res);
    return res;
  };
  //Method to render the two forms of the page: game configuration, and the game-state itself.
  this.printGameFormHTML= function (){
    let gameConfigFormHTML=`
    <form id="gameConfigForm_id"  action="newgame" method="post">
    <fieldset>
      <legend>Configure Game:</legend>
      <div class="myFormLayout">
      <label for="name_id"> Name</label>
      <input type="text" name="name" id="name_id" placeholder="Navn" required minlength="1" maxlength="30">
      <label for="diceCount_id"> Number of Dice:</label>
      <input type="number" name="diceCount" id="diceCount_id" placeholder="5" min="5" max="20" required>
      <input type="submit" id="gameConfigSubmitBtn_id" value="New Game">
      <div id="err" style="visibility:hidden">Error: </div>
      </div>
    </fieldset>
    </form>`;
  
    let scoreTableHTML=this.printScoresHTML();
    let newRoundFormHTML= `<form id="gameControlForm_id"  action="nextround" method="post">
    <fieldset>
    <legend>Play Game:</legend>
    <div><input type="submit" id="gameControlSubmitBtn_id" value="Next Round" ${(this.gameOn && this.round<noRounds) ? "" : "disabled"}> </div>
   <div id="table_id"> <div id="dices_table">
   </div> </div>
   ${scoreTableHTML}\
   </fieldset>
   </form>`;
  return gameConfigFormHTML+newRoundFormHTML;
};
  
  //main method for generating the HTML code for the play
  this.printHTMLPage= function(){
    let page=printHTMLHdr("IWP Yatzy Game","css/style.css","js/yatzy-client.js");
    let h1="<h1 class=\"iwpHead\">IWP Yatzy Game</h1>";

    let footer=`<footer> This program is inspired by ${printUrl("","Kurt Nørmarks", "http://people.cs.aau.dk/~normark/")}\
    exam ${printUrl("","assignment for C-programming", "http://people.cs.aau.dk/~normark/impr-20/eksamensopgaver-e20/Arrays/opgave-2.html")}\
    for first semester students. </footer>`;
    let forms=this.printGameFormHTML();
    page+=printHTMLBody(h1+forms+footer);
    return page;
  };
}

/*
let g=new YatzyGame(-1,"Brian",5);
g.printHTMLPage();

console.log(g.scoreTable.playScore);

for(let round of g.scoreTable.playScore) {
console.log(round);
}
*/