//Returns an object with relavent user info
function get_user_info(){
    //get user info from database
    return userinfo;
}
 //example of output
 userinfo = {
    rank: generate_random_number(43)+3,
    mastery: generate_random_number(3)+3,
    preset:  ["run", "run", "run", "walk", "walk", "stomach", "back"],
};

//Generate a random number from 0 to max
function generate_random_number(max){
    return Math.floor(Math.random() * max);
}

//Returns a type for the quest based on preset
function choose_quest_type(preset){    
    return preset[generate_random_number(preset.length+1)];
}


//Gets the object with quest for a given type
function get_quest_object(type){
    //Connect to database
    //Example of quest object
let quest = {
    run: {
        quest1: {
            target_type: "km",//minutes, km, ...
            base_target: 1, //Base target before modifiers
            modifer: 0.5, //A number to scale modifer
            quest_text: "Run x km" //text for the quest
            },
        quest2: {
            target_type: "minutes",
            base_target: 10,
            modifer: 0.5,
            quest_text: "Run x minutes"
            }
        },
    walk: {
        quest1: {
            target_type: "km",
            base_target: 2,
            modifer: 0.5,
            quest_text: "Walk x km"
            },
        quest2: {
            target_type: "minutes",
            base_target: 30,
            modifer: 0.5,
            quest_text: "Walk x minutes"
            }
        },
    stomach: {
        quest1: {
            target_type: "rep",
            base_target: 10,
            modifer: 0.5,
            quest_text: "Do x sit ups"
            },
        quest2: {
            target_type: "sec",
            base_target: 10,
            modifer: 0.5,
            quest_text: "Do x secounds plank"
            }
        },
    back: {
        quest1: {
            target_type: "rep",
            base_target: 10,
            modifer: 0.5,
            quest_text: "Do x back bends"
            },
        quest2: {
            target_type: "sec",
            base_target: 10,
            modifer: 0.5,
            quest_text: "Do x secounds plank"
            }
        }    
    };
    //output based on example
    return quest[type];
}

function choose_quest(quests){
    return quests["quest" + (generate_random_number(Object.keys(quests).length)+1)]
}


function modify_quest(quest, rank, difficulty, mastery){
    //formular for scaling
    quest["base_target"] = quest["base_target"] * ((rank + difficulty) * 0.1) * quest["modifer"] * (mastery * 0.5);
    quest["quest_text"] = quest["quest_text"].replace("x", quest["base_target"])
    return quest;
}




quest_log = {
    assholeblaster69:{
       daily:{
        "31/3/2024": {
           "type": "pushups",
           "target": 100,
           "amount": 5
         },
 
         "26/3/2024": {
           "type": "run",
           "target": 10,
           "amount": 10
         }
       },
 
       weekly:{
          "25/3/2024":{
             "type": "cycling",
             "target": 40,
             "amount": 40,
         },
 
          "22/3/2024":{
             "type": "walk",
             "target": 60,
             "amount": 35,
         }
       },
 
       monthly:{
         "1/3/2024":{
             "type": "crunches",
             "target": 300,
             "amount": 301,
         },
 
       }
    
     }
 }


function firstOwnKey(object){
    let firstKey
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            firstKey = key;
            break;
        }
    }
    return firstKey
}


function check_current(timespan, userID){
    //connect database
    current_date = new Date();
    let lastestDate;
    switch(timespan){
        case 'daily':{
            let dailies = quest_log[userID][timespan];
            lastestDate = firstOwnKey(dailies);
            let questDay = lastestDate.split("/")[0];
            if (questDay == current_date.getDate()){
                if(dailies[lastestDate]["target"] <= dailies[lastestDate]["amount"]){
                    return "Done";
                }
                return "inProgress";
            }
            }
            return "None";

        case 'weekly':
            let weeklies = quest_log[userID][timespan];
            lastestDate = firstOwnKey(weeklies);
            let questDateStr = lastestDate.split("/");
            //Check if questDay is within 7 days of today
            let questDateObj = new Date(questDateStr[2], questDateStr[1] - 1, questDateStr[0]);
            //Difference in milisec
            diffInMilisec = current_date - questDateObj;
            //Convert to day
            let diffInDays = diffInMilisec / (1000 * 60 * 60 * 24)


            if (Math.abs(diffInDays) <=7){
                if(weeklies[lastestDate]["target"] <= weeklies[lastestDate]["amount"]){
                    return "Done";
                }
                return "inProgress";
            }
            return "None"
        case 'monthly':
            let monthlies = quest_log[userID][timespan];
            lastestDate = firstOwnKey(monthlies);
            let questMonth = lastestDate.split("/")[1];
            if (current_date.getMonth()+1 == questMonth){
                if(monthlies[lastestDate]["target"] <= monthlies[lastestDate]["amount"]){
                    return "Done";
                }
                return "inProgress";
            }
            return "None";
        default:
            return "Fail"

    }
}



function add_quest(timespan){
    //Connect to database
} 

console.log(check_current("monthly", "assholeblaster69"));





document.getElementById("quest1_type").innerText = "Type: " + choose_quest_type(userinfo["preset"])
document.getElementById("quest2_type").innerText = "Type: " + choose_quest_type(userinfo["preset"])
document.getElementById("quest3_type").innerText = "Type: " + choose_quest_type(userinfo["preset"])
