export {ValidationError, NoResourceError, processReq};
import {validateBMIRecordForm, validateBMIStatName,validateBMIStatSearchParams, getBMIStats, selectUserEntries, getEntries, recordBMI} from "./app.js";
import {extractJSON, fileResponse, htmlResponse,extractForm,jsonResponse,errorResponse,reportError,startServer} from "./server.js";
const ValidationError="Validation Error";
const NoResourceError="No Such Resource";

startServer();
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
          case "bmi-records": //just to be nice
            extractJSON(req)
            .then(bmiData => validateBMIRecordForm(bmiData))
            .then(validBmiData => jsonResponse(res,recordBMI(validBmiData)))
            .catch(err=>reportError(res,err));
            break;  
          default: 
            console.error("Resource doesn't exist");
            reportError(res, new Error(NoResourceError)); 
          }
        } 
        break; //END POST URL
      case "GET":{
        let pathElements=queryPath.split("/"); 
        console.log(pathElements);
        //USE "sp" from above to get query search parameters
        switch(pathElements[1]){     
          case "": // "/"
             fileResponse(res,"/html/bmi.html");
             break;
          case "date": {// date
            let date=new Date();
            console.log(date);
            jsonResponse(res,date);
          }
          break;
          case "bmi-records":
          try { 
            if((pathElements.length===2) && (searchParms.toString().length===0)) { // GET /bmi-records => return entire DB
                jsonResponse(res,getEntries());
            } else 
            if ((pathElements.length===2) && (searchParms.toString().length>0)){ // "/bmi-records?name=xxx"
                  let validBMIStatData=validateBMIStatSearchParams(searchParms);
                  jsonResponse(res,getBMIStats(validBMIStatData.userName));
            } else 
            if(pathElements.length===3){ //"/bmi-records/name"
              let validBMIUser=validateBMIStatName(pathElements[2]);
              jsonResponse(res,getBMIStats(validBMIUser));  
            }
            else //resource does not exist
             reportError(res, new Error(NoResourceError));
          }catch(error){
            reportError(res,error)
          } 
          break;
          default: //for anything else we assume it is a file to be served
            fileResponse(res, req.url);
          break;
        }//path
      }//switch GET URL
      break;
      default:
       reportError(res, new Error(NoResourceError)); 
    } //end switch method
  }
  
  