//Returns an object with relavent user info
function get_user_info() {
    //get user info from database
    return userInfo;
}
//example of output
userInfo = {
    rank: generate_random_number(43) + 3,
    mastery: generate_random_number(3) + 3,
    preset: ["cardio", "cardio", "cardio", "core", "core", "upperbody", "lowerbody"],
};

//Generate a random number from 0 to max
function generate_random_number(max) {
    return Math.floor(Math.random() * max);
}

//Returns a type for the quest based on preset
function choose_quest_type(preset) {
    return preset[generate_random_number(preset.length)];
}


function choose_quest(quests) {
    //TODO: TEMP FIX, NEED GET_QUEST_OBJECT TO WORK FISRT
    return quests[Object.keys(quests)[generate_random_number(Object.keys(quests).length)]]
}


function modify_quest(quest, rank, difficulty, mastery) {
    //formular for scaling
    quest["base_target"] = quest["base_target"] * ((rank + difficulty) * 0.1) * (mastery * 0.5);
    quest["quest_text"] = quest["quest_text"].replace("x", quest["base_target"])
    return quest;
}


async function fetchJSON(url) {
    try{
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch JSON');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON', error);
        return null;
    }
}

quest_log = {
    assholeblaster69: {
        daily: {
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

        weekly: {
            "02/4/2024": {
                "type": "cycling",
                "target": 40,
                "amount": 30,
            },

            "22/3/2024": {
                "type": "walk",
                "target": 60,
                "amount": 35,
            }
        },

        monthly: {
            "1/4/2024": {
                "type": "crunches",
                "target": 300,
                "amount": 301,
            },

        }

    }
}


function first_own_key(object) {
    let firstKey
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            firstKey = key;
            break;
        }
    }
    return firstKey
}


function check_current(timespan, userID) {
    //connect database
    const obj_currentDate = new Date();
    let lastestDate;
    switch (timespan) {
        case 'daily': {
            const obj_dailies = quest_log[userID][timespan];
            lastestDate = first_own_key(obj_dailies);
            const questDate = lastestDate.split("/");
            if (questDate[0] == obj_currentDate.getDate() && questDate[1] == (obj_currentDate.getMonth() + 1) && questDate[2] == obj_currentDate.getFullYear()) {
                if (obj_dailies[lastestDate]["target"] <= obj_dailies[lastestDate]["amount"]) {
                    return "Done";
                }
                return lastestDate;
            }
        }
            return "None";

        case 'weekly':
            const obj_weeklies = quest_log[userID][timespan];
            lastestDate = first_own_key(obj_weeklies);
            const questDateStr = lastestDate.split("/");
            //Check if questDay is within 7 days of today
            const questDateObj = new Date(questDateStr[2], questDateStr[1] - 1, questDateStr[0]);
            //Difference in milisec
            const diffInMilisec = obj_currentDate - questDateObj;
            //Convert to day
            const diffInDays = diffInMilisec / (1000 * 60 * 60 * 24)


            if (Math.abs(diffInDays) <= 7) {
                if (obj_weeklies[lastestDate]["target"] <= obj_weeklies[lastestDate]["amount"]) {
                    return "Done";
                }
                return lastestDate;
            }
            return "None"
        case 'monthly':
            const obj_monthlies = quest_log[userID][timespan];
            lastestDate = first_own_key(obj_monthlies);
            const questDate = lastestDate.split("/");
            if ((obj_currentDate.getMonth() + 1) == questDate[1] && obj_currentDate.getFullYear() == questDate[2]) {
                if (obj_monthlies[lastestDate]["target"] <= obj_monthlies[lastestDate]["amount"]) {
                    return "Done";
                }
                return lastestDate;
            }
            return "None";
        default:
            return "Fail"

    }
}



function add_quest_json(quest){
    console.log("Hey");
    fetch('http://127.0.0.1:3366/write_quest_json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quest)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch POST');
            }
            return response.json();
        })
        .then(data => {
            console.log("pog");

        })
        .catch(error => {
            console.error('Error fetch Post quest_log:', error);
        });
}



function open_modal_for_quest(quest, questTimespan, type, user) {
    document.getElementById("myModal").style.display = "block";
    document.getElementById("popupText").innerText = "Choose difficulty for " + questTimespan + " of type: " + type;

    document.querySelectorAll(".difficulty-button").forEach(difficultyButton => {
        difficultyButton.addEventListener("click", (event) => {
            const difficulty = event.target.dataset.difficulty;
            fetchJSON('json/quest_templates.json')
                .then(data => {
                    let obj_Quest = choose_quest(data.quest_templates[type]);
                    obj_Quest = modify_quest(obj_Quest, 3, difficulty, 6);
                    
                    obj_newQuest = new Object;
                    obj_currentDate = new Date;
                    const date = obj_currentDate.getDate() + '/' + (obj_currentDate.getMonth() + 1) + '/' + obj_currentDate.getFullYear();

                    obj_newQuest[date] = {};
                    obj_newQuest[date].type = type;
                    obj_newQuest[date].target = obj_Quest["base_target"];
                    obj_newQuest[date].amount = 1;
                    obj_newQuest[date].state = "incomplete";
                    obj_newQuest.timespan = questTimespan;
                    console.log(obj_newQuest);

                    add_quest_json(obj_newQuest);

                    document.getElementById(quest + "_type").innerText = "Type: " + type + "\nQuest: " + obj_Quest.quest_text;
                    document.getElementById("myModal").style.display = "none";
                    
                    //addQuestJson(obj_newQuest);


                });

        });
    })
    
}

function display_quest(quest, quest_log, userInfox, user) {
    const timespans = ["daily", "weekly", "monthly"];
    let questTimespan = timespans[quest[5] - 1];
    let state = check_current(questTimespan, user);

    if (state == "None") {
        const type = choose_quest_type(userInfo["preset"]);
        document.getElementById(quest + "_type").innerText = "Type: " + type;
        //TODO: Should save this somewhere such the user can't just reload the site for new type :hmm:

        //Create button
        let button = document.createElement("button");
        button.textContent = "Get new Quest!";
        button.id = questTimespan;

        //Append button
        document.getElementById(quest + "_type").appendChild(button)

        //Add event listner to button

        button.addEventListener("click", () => {
            const obj_newQuest = open_modal_for_quest(quest, questTimespan, type, user);



        });


        document.getElementById("close").addEventListener("click", () => {
            document.getElementById("myModal").style.display = "none";

        });



        // create new quest then 
    } else if (state == "Done") {
        document.getElementById(quest + "_type").innerText = "Quest done";
        //Add progressbars
    } else {
        let type = quest_log[user][questTimespan][state].type;
        document.getElementById(quest + "_type").innerText = "Type: " + type;

        //document.getElementById(quest + "_text").innerText = questTemp["cardio"][type].text;
    }

    //Add progressbar
}




display_quest("quest1", quest_log, "Add User Json Here", "assholeblaster69");
display_quest("quest2", quest_log, "Add User Json Here", "assholeblaster69");
display_quest("quest3", quest_log, "Add User Json Here", "assholeblaster69");


