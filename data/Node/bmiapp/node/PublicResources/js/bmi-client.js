'use strict'
//SEE: https://javascript.info/strict-mode
//or, better use javascript "type=module"

//Just a demo function
function showDate(data){
    let p=document.getElementById("id1");
    let d=document.createElement("pre");
    d.textContent=String("Fetched date object: "+data);
    p.parentElement.append(d);
}


/* *******************************************************
* Helper functions to communicate with server
* ********************************************************* */

//Tries to parse a http body as json document. 
//But first ensure taht the response code is OK (200) and
//the content type is actually a json document; else rejects the promise
function jsonParse(response){
  if(response.ok) 
     if(response.headers.get("Content-Type") === "application/json") 
       return response.json();
     else throw new Error("Wrong Content Type");   
 else 
    throw new Error("Non HTTP OK response");
}

//GET a json document at URL
function jsonFetch(url){
  return  fetch(url).then(jsonParse);
}

//POST a json document in data to URL
//Sets content type appropriately first. 
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

/* *******************************************************
* BMI APPLICATION CODE 
* ********************************************************* */

//some helper functions to show/hide/enable/diable elements of the HTML page
function hideElem(elem){
  elem.style.visibility="hidden";
}

function showElem(elem){
 elem.style.visibility="visible";
}
function disableElem(elem){
  elem.style.display="none";
}
//assumes the element should be a block type
function enableElem(elem){
 elem.style.display="block";
}

//Menu button elements have an id of the form: xxxx_Btn_id 
//A corresponding section has an id of the form: xxxx_Section_id 
//This function map from menu button id to section id 
function menuBtnId2SectionId(btnId){
 const featureName=btnId.split("_Btn_id")[0]; //remove _Btn_id suffix, eg "record"
 return featureName+"_Section_id";            //eg record_Section_id 
}

//eventhandler that is called when a menu button is clicked.
//it shows the corresponding section containing the requested feature
function selectFeature(event){
  let selectedFeature=event.target.id; //recordBtn,statsBtn, or helpBtn
  let featureNameId=menuBtnId2SectionId(selectedFeature); 
  let featureElem=document.querySelector("#"+featureNameId); 
  hideFeatures();         //Hide all feature sections
  enableElem(featureElem);//and show only selected feature
  console.log("selected "+featureNameId);
}

//register menu event handler functions
function registerMenuSelect(){
  let menuBtns=document.querySelectorAll("nav button"); //get all buttons in nav element containing the "menu"
  for(let btn of menuBtns) 
    btn.addEventListener("click",selectFeature); 
}

//hide all program feature (corresponding to HTML sections)
function hideFeatures(){
  let menuBtns=document.querySelectorAll("nav button"); //get all buttons in nav element containing the "menu"
  for(let btn of menuBtns) {
    let featureNameId=menuBtnId2SectionId(btn.id); 
    disableElem(document.querySelector("#"+featureNameId));
  }
}


function testAPI(){ 
  //To demo a small API 
  //GET on end-point /bmi-records retrives all records in "DB" as json 
  //GET on end-point /bmi-records/{userName} retrives the users records as json
  jsonFetch("bmi-records")
    .then(v=> {console.log("BMI Records"); console.log(v);})
    .catch(e=>console.log("Ooops"+e.message));
  //WILL NOT EXECUTE SEQUENTIAL
  jsonFetch("bmi-records/Mickey")
  .then(v=> {console.log("Sample BMI Records by name"); console.log(v);})
  .catch(e=>console.log("Ooops Name"+e.message));

  jsonFetch("bmi-records?userName=Mickey")
  .then(v=> {console.log("Sample BMI Records by query"); console.log(v);})
  .catch(e=>console.log("Ooops QS"+e.message));

  //Test serverside validation!! Anybody can post anything to our server!
  jsonPost(document.getElementById("bmiForm_id").action,{userName:"BRIAN", weight:-1, height: 888})
  .then(bmiStatus=>{
    console.log("Status="); console.log(bmiStatus);
  })
  .catch(e=>console.log("SERVER-SIDE VAlidation: PASS "+e.message));

  jsonPost(document.getElementById("bmiForm_id").action,{height: 180})
  .then(bmiStatus=>{
   console.log("Status="); console.log(bmiStatus);
   })
   .catch(e=>console.log("SERVER-SIDE VAlidation: PASS "+e.message));

  fetch("html/bmi.html")
  .then(jsonParse)
  .then(bmiStatus=>{console.log("Status="); console.log(bmiStatus);})
  .catch(e=>console.log("Expect wrong content type: "+e.message));
}

/* In this app we don't use the browsers form submission, but the API defined by the server,
   Hence we extract the values of the input fields of the form and store them in an object, that is
   sent to the server as part of a POST to insert a new record (alse sends updated record back) 
*/ 
function extractBMIData(){
  let bmiData={};
  bmiData.userName=document.getElementById("name_id").value;
  bmiData.height=document.getElementById("height_id").value;
  bmiData.weight=document.getElementById("weight_id").value;
  console.log("Extracted"); console.log(bmiData);
  return bmiData;
}

function sendBMI(event) {
  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  document.getElementById("submitBtn_id").disabled=true; //prevent double submission
  let bmiData=extractBMIData();
  
  jsonPost(document.getElementById("bmiForm_id").action,bmiData)
  .then(bmiStatus=>{
    console.log("Status="); console.log(bmiStatus);
    let resultElem=document.getElementById("result_id");
    resultElem.textContent=`Hi ${bmiData.userName}! Your BMI is ${bmiStatus.bmi}. Since last it has changed ${bmiStatus.delta}!`
    showElem(resultElem);
    document.getElementById("submitBtn_id").disabled=false; //prevent double submission
  }).catch(e=>{
    console.log("Ooops "+e.message);
    alert("Encountered Error: " +e.message + "\nPlease retry!");
    document.getElementById("submitBtn_id").disabled=false;
     //Very primitive error handling
  });
}
//Above we took the action from the form, but we could have set it ourself:. 
//document.getElementById("bmiForm_id").action="/bmi.records";
//document.getElementById("bmiForm_id").method="post";


function showStats(event){
  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  document.getElementById("submitTrackerBtn_id").disabled=true; //prevent double submission
  hideElem (document.querySelector("#stats_result_id"));
  let userName=document.getElementById("tracker_name_id").value;

  const sp= new URLSearchParams(); 
  sp.set("userName",userName); // do a  jsonFetch(`bmi-records?userName=${userName}`)
  jsonFetch(`bmi-records?${sp.toString()}`)
  .then(records=> {console.log("BMI Records:"); console.log(records);
            renderBMITable(userName,records);    
            showElem (document.querySelector("#stats_result_id")); 
            document.getElementById("submitTrackerBtn_id").disabled=false; //prevent double submission
      })
  .catch(e=>{
    console.log("Ooops "+e.message);
    alert("Encountered Error: " +e.message + "\nPlease retry!");
    document.getElementById("submitTrackerBtn_id").disabled=false;
    //Very primitive error handling
  });
}

//Two functions to render the BMI Table using DOM (avoid using .innerHTML!!)

//helper function to create a table row with the text elements in the clmnsText array
//elemType is th or td
function createRow(elemType,clmnsText){
  const row=document.createElement("tr");
  for(let clmnText of clmnsText) {
    const c1=document.createElement(elemType);
    c1.append(clmnText);
    row.append(c1);
  }
  return row;
}

function renderBMITable(userName,records){
  const tableElem=document.createElement("table");
  const theadElem=document.createElement("thead");
  const theadRowElem=document.createElement("tr");
  const theadColumnElem=document.createElement("th")
  const tbodyElem=document.createElement("tbody");
  theadColumnElem.append("BMIStats for user "+userName);
  theadRowElem.append(theadColumnElem);
  theadColumnElem.setAttribute("colspan",2);

  theadElem.append(theadRowElem);
  theadElem.append(createRow("th",["Weight","Bmi"]));
  tableElem.append(theadElem);

  for(let entry of records){
    const row=createRow("td",[entry.weight,entry.bmi]);
    tbodyElem.append(row);
  }
  tableElem.append(tbodyElem);
  tableElem.setAttribute("class","scoretable");
  console.log(tableElem);
  const output=document.querySelector("#stats_result_id");
  output.textContent=""; //clear existing output
  output.append(tableElem);
}


//registers all event handlers: ready to go!!
document.getElementById("bmiForm_id").addEventListener("submit", sendBMI);
document.getElementById("bmiStatsForm_id").addEventListener("submit", showStats);
registerMenuSelect();
console.log("JS er klar!");