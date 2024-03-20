/*
This program is inspired by Kurt Nørmarks exam assignment for C-programming for first semester students.
*/

"use strict";
//const fs = require('fs'); //make use of file system module
import fs, { readFileSync } from 'fs';
import {minDice,maxDice, noRounds, rounds,roundsText,isSpecialRound, getPropertyNameByValue,isRoundString, getRoundID,makeRoundString}
  from"./PublicResources/js/common.js";

export {roll,ScoreTable};

//return a random number between min and max
function random(min,max){
    return Math.floor(Math.random() * (+max + 1 - +min)) + +min; 
}

//returns an array that represents the outcome of rolling M dice
function roll(M){
    let diceRoll=[];
    for(let i=0;i<M;i++){
       diceRoll.push(random(minDice,maxDice)); 
    }
    return diceRoll;
}

//We maintain an array containing the counts of each dice
//count[1] gives the number of 1s in the roll; count[6] gives the numberof 6s
//computes the counts array, given an array of dice values.
/*
function countDice(diceRoll){
    let diceCount=[];
    for(let dice=minDice;dice<=maxDice;dice++){
      let c=0; 
      diceRoll.forEach(d=>{if(d===dice) c++;});
      diceCount[dice]=c;
    }
  return diceCount;
}
*/
function countDice(diceRoll){
  //Array of 7 0-valued elements 
  let diceCount=Array(7).fill(0,0,7);
  for(let dice of diceRoll)
    diceCount[dice]++;
  return diceCount;
}


//the state of the game is stored in a "play" array; each entry is a "struct" (object) with the 
//round id, round name, score, and the original dice roll array 
//record a round into the "play" 

//M=number of dice >=5
function ScoreTable(M){
  this.playScore=[];
  this.M=M;
  for(let roundNo=0;roundNo<noRounds;roundNo++){
      this.playScore[roundNo]= {roundID: getPropertyNameByValue(rounds,roundNo), roundName: roundsText[roundNo], score: 0, diceRoll:[]};
  }
  
  this.noteScore= function(roundNo,score,roll){
       this.playScore[roundNo].score=score;
       this.playScore[roundNo].diceRoll=roll;
  };
  this.getScore=function(roundNo){
      return this.playScore[roundNo];
  };
  this.gameOver=function(){
    for(let roundNo=0;roundNo<noRounds;roundNo++){
      if((!isSpecialRound(roundNo)) && (this.playScore[roundNo].diceRoll.length<=0)) 
         return false; 
    };
    return true;
  };
  /*
    A large collection of helper function to compute scores
  */
  
  //computes the sum of the first 6 rounds (1nes to 6es)
  this.calcSum =function (){
  let sum=0;
  for(let round=rounds.ones; round<=rounds.sixes;round++)
    sum+=this.playScore[round].score;
  return sum;
  };

  //computes if the sum round warrants a "bonus"
  this.calcBonus=function(sum){
   return (sum>=63)?50:0; 
  };
  //calc the value of N:ones, twos, ..., sixes
  this.calcNs=function(diceCount,N){
    return diceCount(N)*N;
  };

  //Compute the score of N largest identical dice
  //start backwards to find the larges N
  this.calcIdentical=function(diceCount,N){
    for(let d=maxDice;d>=minDice;d--)
     if(diceCount[d]>=N) 
        return d*N;
    return 0;
  };

  this.calcPair=function(diceCount){
  return this.calcIdentical(diceCount,2)
  };

  //computes the score for two pairs game
  this.calcTwoPairs=function(diceCount){
    let found=0;
    let pair=[];
    for(let d=maxDice;d>=minDice && found <2; d--)
     if(diceCount[d]>=2){ 
        pair[found]= d*2;
        found++;
     }
    if(found===2) 
      return pair[0]+pair[1];
    else 
      return 0;
  }

  //Little straight: 1-5; big straight 2-6
  //start and stop are the dice value (to be converted into array index starting at 0)
  this.calcSeries=function(diceCount,start,stop){
    let sum=0;
    for(let d=start;d<=stop;d++)
      if(diceCount[d]<d) return 0;
    else 
      sum+=d;
    return sum;
  };

  //a hous mandates 3 of one kind and 2 of (another) kind
  //first find the position of 3 largest identical dice, then 
  //the largest 2 (different) identical
  this.calcHouse=function(diceCount){
    let found3=-1;  //position where 3 identicals is found
    let threes=0;  //score of 3 identical
    let twos=0;    //score of 2 identical
    for(let d=maxDice;d>=minDice&&threes===0; d--)
     if(diceCount[d]>=3){ 
        threes= d*3;
        found3=d;//save position 
     }
    for(let d=maxDice;d>=minDice&&twos===0; d--)
     if(diceCount[d]>=2 && d!==found3){ //skip position of three identical 
        twos= d*2;
     }

    if(twos > 0 && threes > 0) //did we have a house?
      return twos+threes;
     else 
      return 0;
  };

  this.calcChance=function(diceCount){
    let rest=5; //Use only 5 (largest) dice 
    let sum=0; 
    for(let d=maxDice;d>=minDice && rest>0; d--)
      for(let j=0;j<diceCount[d] && rest>0; j++){
        sum += d;
        rest--;
      }
    return sum;
  };

  //In this implementation it takes 5 identical to get yatzy!
  this.calcYatzy=function(diceCount){
    if(this.calcIdentical(diceCount,5)>0) 
      return 50;
    else
      return 0;  
  };

  this.calcTotal=function(){
    let total=0;  
    for(let round=rounds.sum ; round<rounds.total;round++){
      total+=this.playScore[round].score;
    }
    return total;
  };

  this.printScores=function(){
    for(let round=0;round<this.playScore.length;round++){
      let s="";
      this.playScore[round].diceRoll.forEach(d=>s+=d);
      console.log(this.playScore[round].roundName+ "\t\t\t"+this.playScore[round].score + "\t\t\t"+s);
    };
  };
  this.alreadyPlayed=function(round){
    return(this.playScore[round].diceRoll.length>0)
  }
  //assumed that game is played sequentially
  this.playGame=function(round,r){
     let c;
     console.log("executing: " +round+ " "+r);
      //r=roll(this.M);
      //r=[1,5,5,5,2,2,6]; //M=7
      if(this.alreadyPlayed(round)) return;
      c=countDice(r);
      let score=0;
      switch(round){
        case rounds.ones: 
          score=1*c[1];
          break;
        case rounds.twos:
          score=2*c[2];
        break;
        case rounds.threes: 
          score=3*c[3];
          break;
        case rounds.fours: 
          score=4*c[4];
          break;
        case rounds.fives:
          score=5*c[5];
          break;
        case rounds.sixes:
          score=6*c[6];
          break;
        case rounds.onePair:
          score=this.calcPair(c);
          break;
        case rounds.twoPairs:
          score=this.calcTwoPairs(c);
          break;
        case rounds.threeId:
          score=this.calcIdentical(c,3);
          break; 
        case rounds.fourId:
          score=this.calcIdentical(c,4);
          break; 
        case rounds.littleS:
          score=this.calcSeries(c,1,5);
          break; 
        case rounds.bigS:
          score=this.calcSeries(c,2,6);
          break; 
        case rounds.house:
          score=this.calcHouse(c);
          break; 
        case rounds.chance:
          score=this.calcChance(c);
          break;
         case rounds.yatzy:
          score=this.calcYatzy(c); 
          break; 
        default:
          score=0;
          console.log("No Such Game");
      }  
      this.noteScore(round,score,r);
      let sum=this.calcSum();
      this.noteScore(rounds.sum,sum,[]);
      let bonus=this.calcBonus(this.playScore[rounds.sum].score);
      this.noteScore(rounds.bonus,bonus,[]);
      score=this.calcTotal();
      this.noteScore(rounds.total,score,[]);
      console.log("SCORED "+score);

  };
}
/*
function doPlay(){
  let t=new ScoreTable(10);
  let round=0;
  do {
    round=t.playGame(round);
  } while(round<=noRounds);
  t.printScores();
}

doPlay();
*/

