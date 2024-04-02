//DISCLAIMER: This program has been developed for educational purposes at an introductory level. Certain simplifications has been made
//to keep it comphrehensible. 

//We use EC6 modules!
export {validateBMIRecordForm, validateBMIStatForm, renderHTMLBMIUpdatePage, renderHTMLBMIStatPage,recordBMI};
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
//bmiData is here a SearchParam object - [DF 11.9]
//(if the data cannot be validated the router catch the exception and 
// will send an appropriate HTTP Error Response code)
function validateBMIRecordForm(bmiData){

  console.log("Validating"); console.log(bmiData);
 
  if(bmiData.has("userName") && bmiData.has("weight") && bmiData.has("height")){
    let userName=String(bmiData.get("userName"));
    userName=validateUserName(userName);
    let weight=parseInt(bmiData.get("weight"));
    let height=parseInt(bmiData.get("height"));
  
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

//function that validates the constraints of the form data of the
//statistics form: it must contain valid userName
 //bmiData is here a SearchParam object - [DF 11.9]
function validateBMIStatForm(bmiStatData){
 
  if(bmiStatData.has("userName")){
    let userName=String(bmiStatData.get("userName"));
    userName=validateUserName(userName);
    //you may also want to lookup userName in DB to check that the user exists!!
    let validBMIStatData={userName: userName};
    return validBMIStatData;
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


//Process the POST request that adds a new BMI reading to the DB
//It is to return an object with userName, bmi, and bmi delta. This data 
//will be used by the render functions. That functionality could be moved there in this APP-as-SITE version.

function recordBMI(bmiData){
  bmiDB.push(bmiData);
  let bmiStatus={};
  bmiStatus.userName=bmiData.userName;
  bmiStatus.bmi=calcBMI(bmiData.height, bmiData.weight);
  bmiStatus.delta=calcDelta(bmiData.userName);
  console.log(bmiStatus);
  return bmiStatus;
}

/* NB!: Note for more advanced students: After submitting a new BMIData Record, the app shows a page with the resulting BMI.
   If the user now makes a "reload" request at the browser, the form data will be resubmitted, 
   resulting in two or more identical entries at the DB. Web-sites work around this by 
   redirecting the client to a page where it gets the resulting status. 
   In this case, it could be the front page extended with the status table. 
   This is not done in the present simple version.
   The Post/Redirect/Get trick is described at: https://en.wikipedia.org/wiki/Post/Redirect/Get
   More modern apps use JS at the client side: we will de that in a forthcomming lecture.
*/


/* ***************************************************************
 * Functions to render HTML pages
 ******************************************************************* */

function renderHTMLBMIUpdatePage(bmiStatus){
  let page=renderHTMLHdr("BMI Status",["/css/simple.css"]);
  page+=`<body><section>
<h1> BMI Status of ${bmiStatus.userName} </h1>
<output>
Your BMI is ${bmiStatus.bmi}. Since last, it has changed ${bmiStatus.delta}. 
</output>

</section></body>`;
 return page;
}

function selectUserEntries(userName){
  return bmiDB.filter(e=>e.userName===userName);
}

function renderHTMLBMIStatPage(validBMIStatData){
  const userName=validBMIStatData.userName;
  let page=renderHTMLHdr(`BMI Statistics for user ${userName}`,["/css/simple.css"]);
  page+=`<body><section>
  ${renderHTMLBMITable(userName)}
  
  </section></body>`
  return page;
}

function renderHTMLBMITable(userName){
  const userEntries=selectUserEntries(userName);

 let bmiTable=`
  <table id="scoretable">
  <thead>
  <tr>
  <th colspan="2">BMI Stats for user ${userName} </th>
</tr>
    <tr><th>Weight </th><th>BMI</th></tr>
  </thead>
  <tbody>`
  for(let entry of userEntries) 
    bmiTable+= `<tr><td> ${entry.weight}</td> <td> ${calcBMI(entry.height,entry.weight)} </td></tr>`
  bmiTable+=`</tbody></table>`
  return bmiTable;
}


//This functions renders the header part of an HTML document. 
//title: The title of the page
//csss: an array of filename(s) of stylesheets
//scripts: an array of filename(s) of JavaScripts to be included 
function renderHTMLHdr(title,csss=[],scripts=[]){

  let cssString="";
  for(let i=0;i<csss.length;i++){
    let css=csss[i];
    cssString+=`${css===""?"":"<link rel=\"stylesheet\" href=\""+css+"\">\n"}`;
  } 
  let scriptString="";
  for(let i=0;i<scripts.length;i++){
    let script=scripts[i];
    scriptString+=   `${script===""?"":"<script defer src=\""+script+"\"></script>\n"}`;
  } 
  
  let str=`
  <!DOCTYPE html>
  <html lang="da">
  <head>
    <title>${title}</title>
    <meta charset="utf-8">
    ${cssString}
    ${scriptString}
  </head>`;
  return str;
}


