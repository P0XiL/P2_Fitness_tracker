//DISCLAIMER: This program has been developed for educational purposes at an introductory level. Certain simplifications has been made
//to keep it comphrehensible. 

//We use EC6 modules!
export {renderHTMLBMIUpdatePage, renderHTMLBMIStatPage,recordBMI};
import { ValidationError } from "./router.js";

/* ***************************************************
 * Application code for the BMI tracker application 
 * Mostly C-style programming
 ***************************************************** */

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


