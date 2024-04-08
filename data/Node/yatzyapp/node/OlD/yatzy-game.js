/*
This program is inspired by Kurt Nørmarks exam assignment for C-programming for first semester students.
http://people.cs.aau.dk/~normark/impr-20/eksamensopgaver-e20/Arrays/opgave-2.html
This version of Yatzy is intentionally programmed as a simple C-style implementation in JavaScript; 
Hence, more elegant JS implementations can be programmed. For IWP, this imperative style verstion is perfectly OK! 
*/


"use strict";
//const fs = require('fs'); //make use of file system module
import fs, { readFileSync } from 'fs';

//const M=20; //Number of dice >=5 
const minDice=1; const maxDice=6; //min and max value of a normal dice.


//A Yatzy "play" consists of completing 15 game rounds, plus computing 3 "special" status (sum,bonus,total).
//Here simplified to 18 rounds.
export const noRounds=18;
const rounds={ //an enum style object
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

export function isSpecialRound(round){ 
  return ((round===rounds.sum || round===rounds.bonus || round===rounds.total));
}


const roundsText=["1s", "2s",  "3s", "4s", "5s", "6s", "Sum", "Bonus", "1 Pair", "2 Pairs", "Three Identical", "Four Identical",
  "Little Straight",  "Big Straight",   "House",   "Chance",   "Yatzy",  "Total Score"
];


//return a random number between min and max
function random(min,max){
    return Math.floor(Math.random() * (+max + 1 - +min)) + +min; 
}
//returns an array that represents the outcome of rolling M dice
function roll(M){
    let diceRoll=[];
    for(let i=0;i<M;i++){
       diceRoll[i]= random(minDice,maxDice); 
    }
    return diceRoll;
}

//We maintain an array containing the counts of each dice
//count[0] gives the number of 1s in the roll; count[5] gives the numberof 6s
function i2d(index){ //converts index to dice value
  return index+1;
}
function d2i(dice){ //converts dice value to its index position
  return dice-1;
}

//computes the counts array, given an array of dice values.
function countDice(diceRoll){
    let diceCount=[]; //initialize with 0 counts
    for(let i=0;i<maxDice;i++){
      diceCount[i]=0;
    }
    for(let i=0;i<diceRoll.length;i++){ //foreach dice, increment the corresponding count entry
        diceCount[d2i(diceRoll[i])]++;
      }
  return diceCount;
}

//the state of the game is stored in a "play" array; each entry is a "struct" (object) with the 
//round id, round name, score, and the original dice roll array 
//record a round into the "play" 
function noteScore(play,round,score,roll){
  play[round]= {roundID: round, roundName: roundsText[round], score: score, diceRoll:roll};
}

export function createScoreTable(){
  let playScore=[];
  for(let round=0;round<noRounds;round++)
  playScore[round]= {roundID: round, roundName: roundsText[round], score: 0, diceRoll:[]};
  return playScore;
}
/*
  A large collection of helper function to compute scores
*/

//computes the sum of the first 6 rounds (1nes to 6es)
function calcSum(play){
  let sum=0;
  for(let round=rounds.ones; round<=rounds.sixes;round++)
    sum+=play[round].score;
  return sum;
}
//computes if the sum round warrants a "bonus"
function calcBonus(sum){
  if(sum>=63) 
      return 50;
    else 
      return 0;
}

//Compute the score of N identical dice
//start backwards to find the larges N
function calcIdentical(diceCount,N){
  for(let i=d2i(maxDice);i>=d2i(minDice);i--)
   if(diceCount[i]>=N) 
      return i2d(i)*N;
  return 0;
}

function calcPair(diceCount){
  return calcIdentical(diceCount,2)
}
//computes the score for two pairs game
function calcTwoPairs(diceCount){
  let found=0;
  let pair=[];
  for(let i=d2i(maxDice);i>=d2i(minDice) && found <2; i--)
   if(diceCount[i]>=2){ 
      pair[found]= i2d(i)*2;
      found++;
   }
  if(found===2) 
    return pair[0]+pair[1];
    else 
  return 0;
}
//Little straight: 1-5; big straight 2-6
//start and stop are the dice value (to be converted into array index starting at 0)
function calcSeries(diceCount,start,stop){
  let sum=0;
  for(let i=d2i(start);i<=d2i(stop);i++)
    if(diceCount[i]<1) return 0;
  else 
    sum+=i2d(i);
  return sum;
}

//a hous mandates 3 of one kind and 2 of (another) kind
//first find the position of 3 largest identical dice, then 
//the largest 2 (different) identical
function calcHouse(diceCount){
  let found3=-1;  //position where 3 identicals is found
  let threes=0;  //score of 3 identical
  let twos=0;    //score of 2 identical
  for(let i=d2i(maxDice);i>=d2i(minDice)&&threes===0; i--)
   if(diceCount[i]>=3){ 
      threes= i2d(i)*3;
      found3=i;//save position 
   }
  for(let i=d2i(maxDice);i>=d2i(minDice)&&twos===0; i--)
   if(diceCount[i]>=2 && i!==found3){ //skip position of three identical 
      twos= i2d(i)*2;
   }

  if(twos > 0 && threes > 0) //did we have a house?
    return twos+threes;
   else 
    return 0;
}

function calcChance(diceCount){
  let rest=5; //Use only 5 (largest) dice 
  let sum=0; 
  for(let i=d2i(maxDice);i>=d2i(minDice) && rest>0; i--)
    for(let j=0;j<diceCount[i] && rest>0; j++){
      sum += i2d(i);
      rest--;
    }
  return sum;
}
//In this implementation it takes 5 identical to get yatzy!
function calcYatzy(diceCount){
  if(calcIdentical(diceCount,5)>0) 
    return 50;
  else
    return 0;  
}

function calcTotal(play){
  let total=0;
  for(let round=rounds.sum ; round<rounds.total;round++){
    total+=play[round].score;
  }
  return total;
}

function printScores(play){
  for(let round=0;round<play.length;round++)
   console.log(play[round].roundName+ "\t\t\t"+play[round].score);
}

//assumed that game is played sequentially
export function playGame(play,round,M){
     let r,c;
      r=roll(M);
      //r=[1,5,5,5,2,2,6]; //M=7
      c=countDice(r);
      let score=0;
      switch(round){
        case rounds.ones: 
          noteScore(play,round,1*c[0],r);
          break;
        case rounds.twos:
          noteScore(play,round,2*c[1],r);
        break;
        case rounds.threes: 
          noteScore(play,round,3*c[2],r);
          break;
        case rounds.fours: 
          noteScore(play,round,4*c[3],r);
          break;
        case rounds.fives:
          noteScore(play,round,5*c[4],r);
          break;
        case rounds.sixes:
          noteScore(play,round,6*c[5],r);
          round++;
          //no break
        case rounds.sum: 
          score=calcSum(play);
          noteScore(play,round,score,null);
          round++;
          //no break
        case rounds.bonus: 
          score=calcBonus(play[rounds.sum].score);
          noteScore(play,round,score,null);
          break;
        case rounds.onePair:
          score=calcPair(c);
          noteScore(play,round,score,r);
          break;
        case rounds.twoPairs:
          score=calcTwoPairs(c);
          noteScore(play,round,score,r);
          break;
        case rounds.threeId:
          score=calcIdentical(c,3);
          noteScore(play,round,score,r);
          break; 
        case rounds.fourId:
          score=calcIdentical(c,4);
          noteScore(play,round,score,r);
          break; 
        case rounds.littleS:
          score=calcSeries(c,1,5);
          noteScore(play,round,score,r);
          break; 
        case rounds.bigS:
          score=calcSeries(c,2,6);
          noteScore(play,round,score,r);
          break; 
        case rounds.house:
          score=calcHouse(c);
          noteScore(play,round,score,r);
          break; 
        case rounds.chance:
          score=calcChance(c);
          noteScore(play,round,score,r);
          break;
         case rounds.yatzy:
          score=calcYatzy(c);
          noteScore(play,round,score,r);
          round++
          //no break; 
        case rounds.total:
          score=calcTotal(play);
          noteScore(play,round,score,null);
        break; 
      }  
      return round+1;
}
