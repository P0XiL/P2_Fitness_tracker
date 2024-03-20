
//We use EC6 modules!
import {extractJSON, fileResponse, htmlResponse,extractForm,jsonResponse,errorResponse,reportError,startServer} from "./server.js";
const ValidationError="Validation Error";
const NoResourceError="No Such Resource";
export {ValidationError, NoResourceError, processReq};

startServer();


/* ****************************************************************************
 * Application code for the BAC tracker application 
 ***************************************************************************** */
function round2Decimals(floatNumber){
  return Math.round(floatNumber*100)/100;
 }

function round4Decimals(floatNumber){
  return Math.round(floatNumber*10000)/10000;
 }

//constants for validating input from the network client
const maxWeight=300;
const minWeight=1;
const minNameLength=1;
const maxNameLength=30;
const MaleGender="Male";
const FemaleGender="Female";

//function that validates the constraints of the drinkForm
//It  must contain valid name,weight, Gender attributes
function validateBacDrinkForm(bacDrinkFormData){
  let nameLen;
  let name;
  let weight; 
  let gender; 
  try {
    nameLen=bacDrinkFormData.name.length;
    name=bacDrinkFormData.name;
    weight=Number(bacDrinkFormData.weight);
    gender=bacDrinkFormData.gender;
  }
  catch(e) {console.log (e);throw (new Error(ValidationError));}

    if((nameLen>=minNameLength) && (nameLen<=maxNameLength) &&
       (minWeight <= weight) && (weight <=maxWeight) &&
       ((gender===MaleGender)||(gender===FemaleGender))){
      let drinkData={name: name, weight:weight, gender: gender};
      return drinkData;
    } 
    else throw(new Error(ValidationError));
 }

/* "Database" emulated by maintained an in-memory array of BAC Data objects 
   Higher index means newer data record: you can insert by simply 
  'push'ing new data records 
  */

//insert some sample data 
let now=new Date();
let past=new Date (now.getTime()-2000); //some seconds in the past. 
let sampleDrinkData1={name: "Mickey", gender: MaleGender, weight:90, drinkTime: past};
let sampleDrinkData2={name: "Mickey", gender: MaleGender, weight:90, drinkTime: past};
let sampleDrinkData3={name: "Mickey", gender: MaleGender, weight:90, drinkTime: now};
let bacDB=[sampleDrinkData1, sampleDrinkData2,sampleDrinkData3]; //

function lookup(name){
  return bacDB.find(e=>e.name ===name)
}

//Adds information about a consumed new drink to the database
//A record consist of validated form data plus time the drink is consumed. 
function recordDrink(drinkData){
  drinkData.drinkTime=new Date();
  bacDB.push(drinkData);
  console.log(bacDB);
  return drinkData.drinkTime; //Drink timestame not used by client in this version. 
}


/* A helper function that computes the time difference between two date objects 
   (Remark, that it is simplified as it does not account for daylight savings time)
*/
const MS_PER_HOUR = 1000 * 60 * 60;
//const MS_PER_HOUR = 1000*10; //speedup simulation 10s corresponds to 1 hour

function dateDiffInHours(recentDate, oldDate) {
  let diff=(recentDate.getTime()-oldDate.getTime())/MS_PER_HOUR;
  return diff;
}


/* For a person of the given gender and weight, the function computes
   the resulting BAC by "simulating" the bac  
*/
function calcBAC(name){
  console.log("computing "+name);
  let i=0;
  let bac=0;
  let previousDrinkTime;
  let foundFirst=false;
  //find first drink
  while(i<bacDB.length && !foundFirst){
   if(bacDB[i].name===name) {
      foundFirst=true;
      previousDrinkTime=bacDB[i].drinkTime;
      bac=drink2BAC(bacDB[i].weight,bacDB[i].gender);
    }
    i++;
  }
  if(!foundFirst) return null;//name not found. 
  //add effect of subsequent drinks
  for(;i<bacDB.length; i++){
    if(bacDB[i].name===name) {
      let drinkTime=bacDB[i].drinkTime;
      let duration=dateDiffInHours(drinkTime,previousDrinkTime);
      bac=burnDrink(bac,duration);
      bac+=drink2BAC(bacDB[i].weight,bacDB[i].gender);
      previousDrinkTime=drinkTime;
    }
  }
  //and burn BAC untill "now"
  let duration=dateDiffInHours(new Date(),previousDrinkTime);
  bac=burnDrink(bac,duration);
  console.log("CALC "+bac);
  return round4Decimals(bac);
}


/* This function simulate the effect of taking each drink at a time, and accumulating the BAC*/  
/* The solution is simplified, as it allows burning drinks in parallel independently */ 
function calcBACSimple(name){
  console.log("computing "+name);
  let bacSum=0;
  let now=new Date();
  for(let i=0;i<bacDB.length; i++){
    if(bacDB[i].name===name) {
      let drinkTime=bacDB[i].drinkTime;
      let duration=dateDiffInHours(now,drinkTime);
      let bacIncrement=drink2BAC(bacDB[i].weight,bacDB[i].gender);
      bacSum+=burnDrink(bacIncrement,duration);
    }
  }
  console.log("Final: "+bacSum);
  return round4Decimals(bacSum);
}

function burnDrink(initialBAC,duration){
  return Math.max(0,initialBAC-0.15*duration);
}
const ALCOHOL_IN_DRINK=12;
function drink2BAC(weight,gender){
 if(gender===MaleGender) 
     return ALCOHOL_IN_DRINK/(weight*0.7)
 else 
   return ALCOHOL_IN_DRINK/(weight*0.6);
}

/*
//https://www.sundhed.dk/borger/patienthaandbogen/psyke/sygdomme/alkohol/alkoholpromille-beregning/

For kvinder:
Alkohol i gram / (kropsvægten i kg x 60 %) - (0,15 x timer fra drikkestart) = promille
For mænd:
Alkohol i gram / (kropsvægten i kg x 70 %) - (0,15 x timer fra drikkestart) = promille
Du finder oversigt over forskellige drikkevarers indhold af alkohol i gram i artiklen fakta om alkohol
*/




/* *********************************************************************
   Setup HTTP route handling: Called when a HTTP request is received 
   ******************************************************************** */
function processReq(req,res){
  console.log("GOT: " + req.method + " " +req.url);

  let baseURL = 'http://' + req.headers.host + '/';    //https://github.com/nodejs/node/issues/12682
  let url=new URL(req.url,baseURL);
  let searchParms=new URLSearchParams(url.search);
  let queryPath=decodeURIComponent(url.pathname); //Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string

  switch(req.method){
    case "POST": {
      let pathElements=queryPath.split("/"); 
      console.log(pathElements[1]);
       switch(pathElements[1]){
        case "/bac-records":
        case "bac-records": //just to be nice
          extractJSON(req)
          .then(bacDringFormData => validateBacDrinkForm(bacDringFormData))
          .then(drinkData => jsonResponse(res,recordDrink(drinkData)))
          .catch(err=>reportError(res,err));
          break;
        default: 
          console.error("Resource doesn't exist");
          reportError(res, NoResourceError); 
        }
      } 
      break; //POST URL
    case "GET":{
      let pathElements=queryPath.split("/"); 
      console.log(pathElements);
      //USE "sp" from above to get query search parameters
      switch(pathElements[1]){     
        case "": // 
           fileResponse(res,"/html/bac.html");
           break;
        case "date":{ // 
          let date=new Date();
          console.log(date);
          jsonResponse(res,date);
        }
        break;
        case "bac-records": 
        if(pathElements.length===3 && lookup(pathElements[2])){ // handle url of the format "/bac-records/name"
          res.setHeader('Cache-Control', 'no-store');
          return jsonResponse(res,{name: pathElements[2], bac: calcBAC(pathElements[2])});
        } 
        else return errorResponse(res,404,"No Such Resource");
        break;
 
        default: //for anything else we assume it is a file to be served
           fileResponse(res, req.url);
         break;
      }//path
    }//switch GET URL
    break;
    default:
     reportError(res, NoResourceError); 
  } //end switch method
}

 
