//DISCLAIMER: This program has been developed for educational purposes at an introductory level. Certain simplifications has been made
//to keep it comphrehensible. 

//We use EC6 modules!
export {validateBMIRecordForm, validateBMIStatName,validateBMIStatSearchParams,getEntries, getBMIStats, selectUserEntries,recordBMI};
import { ValidationError } from "./router.js";

/* ***************************************************
 * Application code for the BMI tracker application 
 * Mostly C-style programming
 ***************************************************** */

//constants for validating input from the client
const maxHeight=300;
const minHeight=1;
const maxWeight=300;
const minWeight=1;
const minNameLength=1;
const maxNameLength=30;
const minAge=5;
const maxAge=120;
const femaleSex="female";
const maleSex="male";
const indifferentSex="indifferent";

//remove potentially dangerous/undesired characters 
function sanitize(str){
  str=str
.replace(/&/g, "")
.replace(/</g, "")
.replace(/>/g, "")
.replace(/"/g, "")
.replace(/'/g, "")
.replace(/`/g, "")
.replace(/\//g, "");
return str.trim();
}

//helper function for validating form data 
function validateUserName(userName){
  let name=sanitize(userName); 
  let nameLen=name.length;
  if((nameLen>=minNameLength) && (nameLen<=maxNameLength)) 
     return name;
  throw(new Error(ValidationError)); //Exceptions treated in a future class
}


//validates the constraints of the user input of BMIData object
//bmiData must contain valid name,height,weight attributes
//bmiData is here a JavaScript object orignating from JSON. 

//(if the data cannot be validated the router catch the exception and 
// will send an appropriate HTTP Error Response code)
function validateBMIRecordForm(bmiData){

  console.log("Validating"); console.log(bmiData);
  //alternative to comparing with undefined is to check using o.hasOwnProperty
  if( (bmiData.userName!==undefined) && 
      (bmiData.weight!==undefined) && 
      (bmiData.height!==undefined)){
    let userName=String(bmiData.userName);
    userName=validateUserName(userName);
    let weight=parseInt(bmiData.weight);
    let height=parseInt(bmiData.height);
  
    if((minHeight <= height) && (height <= maxHeight) &&
    (minWeight <= weight) && (weight <=maxWeight)) {
        //return a fresh object with ONLY the validated fields
        let validBMIData={userName: userName, height: height, weight: weight};
        console.log("Validated: "); console.log(validBMIData);
        return validBMIData;
     }
    } 
  throw(new Error(ValidationError));
}


//function that validates the constraints of the username for the resource
//bmi-records/userName: it must contain valid userName that exists in the DB
function validateBMIStatName(userName){
   if((userName!==undefined) ){
    userName=String(userName);
    userName=validateUserName(userName);
    if(bmiLookup(userName)) return userName;
  } 
  throw(new Error(ValidationError));
}

//function that validates the constraints of the form data of the
//statistics form: it must contain valid userName that exists in the DB
//bmiData is here a SearchParams 
function validateBMIStatSearchParams(bmiStatData){
  if(bmiStatData.has("userName")){
    let userName=String(bmiStatData.get("userName"));
    userName=validateUserName(userName);
    if(bmiLookup(userName)){
      //you may also want to lookup userName in DB to check that the user exists!!
      let validBMIStatData={userName: userName};
      return validBMIStatData;
    }
  } 
  throw(new Error(ValidationError));
}


function round2Decimals(floatNumber){
  return Math.round(floatNumber*100)/100;
}

function calcBMI(height,weight){
  let bmi= weight/(height/100*height/100);
  bmi=round2Decimals(bmi);
  console.log(height, weight,bmi);
  return bmi;
}

/* "Database" emulated by maintained an in-memory array of BMIData objects 
   Higher index means newer data record: you can insert by simply 
  'push'ing new data records */

let sampleBMIData={userName: "Mickey", height: 180, weight:90};
let bmiDB=[sampleBMIData]; //



//compare the latest two entries for 'name' and compute difference of bmi numbers
//return 0 if only one or no record is found
//This solution uses C-like JS, and can be simplified using filter and map, indexOf
function calcDelta(name){
  console.log("looking up "+name);
  console.log(bmiDB);
  let newBMIIndex=-1;
  let previousBMIIndex=-1;
  let i=0;
  //find newest entry (hence search backward  in array)
  for(i=bmiDB.length-1; i>=0;i--)
   if(bmiDB[i].userName===name) {
     newBMIIndex=i;
     console.log("NEW "+i);
     break;
   } 
   //search for second oldest
   for(--i;i>=0;i--) 
     if(bmiDB[i].userName===name) {
      previousBMIIndex=i;
      console.log("PREV "+i);
      break;
     } 
   if(newBMIIndex>=0 && previousBMIIndex>=0) 
     return round2Decimals(calcBMI(bmiDB[newBMIIndex].height, bmiDB[newBMIIndex].weight)-
     calcBMI(bmiDB[previousBMIIndex].height, bmiDB[previousBMIIndex].weight));   
   else 
   return 0;
}


function calcBMIChange(newBMIEntry, previousBMIEntry){
  return round2Decimals(calcBMI(newBMIEntry.height, newBMIEntry.weight)-
  calcBMI(previousBMIEntry.height, previousBMIEntry.weight));   
}

function bmiLookup(name){ //C-STYLE
  console.log("looking up "+name);
  let i=0;

  for(i=bmiDB.length-1; i>=0;i--)
   if(bmiDB[i].userName===name) {
     return bmiDB[i]; 
  }
  //none found: return undefined
}
function selectUserEntries(userName){
  return bmiDB.filter(e=>e.userName===userName);
}

function getBMIStats(userName){
  let stats=[];
  const entries=selectUserEntries(userName);
   for(let entry of entries){
     let stat={...entry} //SHALLOW copy of DB enntry (could also use Object.assign instead of spreading operator)
     stat.bmi=calcBMI(entry.height,entry.weight); //add BMI number
     stats.push(stat);
  }
  return stats;
}
function getEntries(){
  return bmiDB;
}

//Process the POST request that adds a new BMI reading to the DB
//It is to return an object with userName, bmi, and bmi delta. This data 
//will be used by the client. 

function recordBMI(bmiData){
  console.log(bmiData);
  bmiDB.push(bmiData);
  let bmiStatus={};
  bmiStatus.userName=bmiData.userName;
  bmiStatus.bmi=calcBMI(bmiData.height, bmiData.weight);
  bmiStatus.delta=calcDelta(bmiData.userName);
  //bmiStatus.warning=( (bmiData.sex===maleSex) && (bmiStatus.bmi>30));
  console.log(bmiStatus);
  return bmiStatus;
}

