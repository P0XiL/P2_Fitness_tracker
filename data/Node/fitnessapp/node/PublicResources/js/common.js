export{minDice,maxDice, noRounds, rounds,roundsText,isSpecialRound,getPropertyNameByValue,isRoundString, getRoundID,makeRoundString};


//A simple model of a dice is a number beteen 1 and6
const minDice=1; const maxDice=6; //min and max value of a normal dice.

//A Yatzy "play" consists of completing 15 game rounds, plus computing 3 "special" status (sum,bonus,total).
//Here simplified to 18 rounds.
const noRounds=18;
const rounds={ //as C-enums doesn't directly exist in JS, we emulate it using an object
  ones:   0,
  twos:   1,
  threes: 2,
  fours:  3,
  fives:  4,
  sixes:  5,
  sum:    6,
  bonus:  7,
  onePair:  8,
  twoPairs:  9,
  threeId:  10,
  fourId:   11,
  littleS:  12,
  bigS:     13,
  house:    14,
  chance:   15,
  yatzy:    16,
  total:    17
};

function isSpecialRound(round){ 
  return ((round===rounds.sum || round===rounds.bonus || round===rounds.total));
}


const roundsText=["1s", "2s",  "3s", "4s", "5s", "6s", "Sum", "Bonus", "1 Pair", "2 Pairs", "Three Identical", "Four Identical",
  "Little Straight",  "Big Straight",   "House",   "Chance",   "Yatzy",  "Total Score"
];


//getPropertyNameByValue(theObject,value) returns the first propety name of theObject that has the desired value
//e.g getPropertyByValue(rounds,16) returns 'yatzy' 
//alternative (C-style) solution is to create another rounds const that maps the other way 
//like const roundByName{0:"ones",...} then roundByName[16] gives "yatzy"

function getPropertyNameByValue(theObject,value) {
  let propertyNames=Object.getOwnPropertyNames(theObject);
  for (let propertyName of propertyNames) //works ok for small objects called infrequently
     if(theObject[propertyName]==value) return propertyName;
}

//in the HTML page we use strings using a specific format to identity elemenents containing dice. 
//Does id string match the format: "round_5_dices_id" -> ["round", "5", "dices", "id"]
function isRoundString(id){ 
 let s=id.split("_");
 if(s.length===4 && s[0]==="round" && s[2]==="dices" && s[3]==="id")
    return true
 else 
  return false; 
}
//Extract the roundNo from the roundString
function getRoundID(roundString){
   let roundNo=parseInt(roundString.split("_")[1]); // "round_5_dices_id" -> ["round", "5", "dices", "id"]
   return roundNo;
}
//Convert roundNo to the round id format. 
function makeRoundString(roundNo){
  return `round_${roundNo}_dices_id`;
}