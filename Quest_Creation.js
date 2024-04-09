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
    return preset[generate_random_number(preset.length)];
}


//Gets the object with quest for a given type
function get_quest_object(type){
    //Connect to database
    //Path to JSON file
    const filePath = '/quest_templates.json';
    

    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err){
            throw new Error('Failed to read Quest Templates Json');
        }
    try {
        const jsonData = JSON.parse(data);
        return jsonData.type;
    } catch (error) {
        throw new Error('Error parsing json', error);
    }
    
    });
}


function choose_quest(quests){
    //TODO: TEMP FIX, NEED GET_QUEST_OBJECT TO WORK FISRT
    return quests[Object.keys(quests)[generate_random_number(Object.keys(quests).length)]]
}


function modify_quest(quest, rank, difficulty, mastery){
    //formular for scaling
    console.log(quest);
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
            let questDate = lastestDate.split("/");
            if (questDate[0] == current_date.getDate() && questDate[1] == (current_date.getMonth() + 1) && questDate[2] == current_date.getFullYear() ){
                if(dailies[lastestDate]["target"] <= dailies[lastestDate]["amount"]){
                    return "Done";
                }
                return lastestDate;
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
                return lastestDate;
            }
            return "None"
        case 'monthly':
            let monthlies = quest_log[userID][timespan];
            lastestDate = firstOwnKey(monthlies);
            let questDate = lastestDate.split("/");
            if ((current_date.getMonth() + 1) == questDate[1] && current_date.getFullYear() == questDate[2]){
                if(monthlies[lastestDate]["target"] <= monthlies[lastestDate]["amount"]){
                    return "Done";
                }
                return lastestDate;
            }
            return "None";
        default:
            return "Fail"

    }
}



function display_quest(quest, quest_log, userinfox, user){
    let timespans = ["daily", "weekly", "monthly"];
    let quest_timespan = timespans[quest[5] - 1];
    let state = check_current(quest_timespan, user);
    //let questTemp = get_quest_object();
    
    if (state == "None"){
        const type = choose_quest_type(userinfo["preset"]);
        document.getElementById(quest + "_type").innerText = "Type: " +  type;
        //TODO: Should save this somewhere such the user can't just reload the site for new type :hmm:

        //Create button
        let button = document.createElement("button");
        button.textContent = "Get new Quest!";

        //Append button
        document.getElementById(quest + "_type").appendChild(button)

        //Add event listner to button
        button.addEventListener("click", ()=>{
            document.getElementById("myModal").style.display = "block";
        });
        document.getElementById("popupText").innerText = "Choose difficulty for " + quest_timespan + " of type: " + type;

        document.querySelectorAll(".difficulty-button").forEach(button => {
            button.addEventListener("click", (event) => {
                const difficulty = event.target.dataset.difficulty;
                
                const obj_questOfType = get_quest_object(type);
                let obj_quest = choose_quest("quests");


                //TODO: USE USERINFO TO GET RANK AND MASTERY
                obj_quest = modify_quest(quest_Obj, 3, difficulty, 6);
                console.log(quest_Obj.quest_text);
                document.getElementById(quest + "_type").innerText = "Type: " +  type + "\nQuest: " + quest_Obj.quest_text;

                document.getElementById("myModal").style.display = "none";
            })
        })

        document.getElementById("close").addEventListener("click", () => {
            document.getElementById("myModal").style.display = "none";
        });
        

        
         // create new quest then 
    } else if (state == "Done" ){
        document.getElementById(quest + "_type").innerText = "Quest done"; 
        //Add progressbars
    } else {
        let type = quest_log[user][quest_timespan][state].type;
        document.getElementById(quest + "_type").innerText = "Type: " + type;
        console.log(type);
        
        //document.getElementById(quest + "_text").innerText = questTemp["cardio"][type].text;
    }
         
        //Add progressbar
}




display_quest("quest1", quest_log, "Add User Json Here", "assholeblaster69");
display_quest("quest2", quest_log, "Add User Json Here", "assholeblaster69");
display_quest("quest3", quest_log, "Add User Json Here", "assholeblaster69");

