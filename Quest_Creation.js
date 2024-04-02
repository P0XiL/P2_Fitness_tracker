//Returns an object with relavent user info
function get_user_info(){
    //get user info from database
    return userinfo;
}
 //example of output
 userinfo = {
    rank: generate_random_number(43)+3,
    mastery: generate_random_number(3)+3,
    preset:  ["cardio", "cardio", "cardio", "core", "core", "upperbody", "lowerbody"],
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
    fetch('quest_templates.json')
        .then(response => {
            if (!response.ok){
                throw new Error('Failed to fetch Quest Templates JSON');
            }
            return response.json();
        })
        .then(data => {return data
        })
        .catch(error => {
            console.error('Error', error)
        })
}

function choose_quest(quests){
    return quests["quest" + (generate_random_number(Object.keys(quests).length)+1)]
}


function modify_quest(quest, rank, difficulty, mastery){
    //formular for scaling
    quest["base_target"] = quest["base_target"] * ((rank + difficulty) * 0.1) * (mastery * 0.5);
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
          "02/4/2024":{
             "type": "cycling",
             "target": 40,
             "amount": 30,
         },
 
          "22/3/2024":{
             "type": "walk",
             "target": 60,
             "amount": 35,
         }
       },
 
       monthly:{
         "1/4/2024":{
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



function add_quest(quest){
    //Connect to database
} 

console.log(check_current("monthly", "assholeblaster69"));



console.log(choose_quest_type(userinfo["preset"]));




function display_quest(quest_type){
    let timespans = ["daily", "weekly", "monthly"];
    let quest_timespan = quest_type[5];
    if (check_current(timespans[quest_timespan - 1], "assholeblaster69") == "inProgress"){
        document.getElementById(quest_type).innerText = "Type: " + "Pog insert add_quest";
    } else if (check_current(timespans[quest_timespan - 1], "assholeblaster69") == "Done" ){
        document.getElementById(quest_type).innerText = "Done";
    } else {
        document.getElementById(quest_type).innerText = "No current quest";
    }
}


display_quest("quest1_type");
display_quest("quest2_type");
display_quest("quest3_type");