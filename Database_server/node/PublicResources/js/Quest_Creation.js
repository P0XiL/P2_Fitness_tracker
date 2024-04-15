//Returns an object with relavent user info
function get_user_info() {
    //get user info from database
    return userInfo;
}
//example of output
userInfo = {
    rank: generate_random_number(43),
    mastery: generate_random_number(3),
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
    return quests[Object.keys(quests)[generate_random_number(Object.keys(quests).length)]]
}


function modify_quest(quest, rank, difficulty, mastery, timespan) {
    //formular for scaling
    const min = quest["base_target"];
    switch (timespan) {
        case 'daily':
            quest["base_target"] = Math.floor(quest["base_target"] * ((rank + parseInt(difficulty)) * 0.1) * (mastery * 0.5) * 1);
            break;
        case 'weekly':
            quest["base_target"] = Math.floor(quest["base_target"] * ((rank + parseInt(difficulty)) * 0.1) * (mastery * 0.5) * 4);
            break;
        case 'monthly':
            quest["base_target"] = Math.floor(quest["base_target"] * ((rank + parseInt(difficulty)) * 0.1) * (mastery * 0.5) * 13);
            break;
    }
    
    if (quest["base_target"] < min){
        quest["base_target"] = min
        quest["quest_text"] = quest["quest_text"].replace("x", quest["base_target"])
    }
    quest["quest_text"] = quest["quest_text"].replace("x", quest["base_target"])
    return quest;
}


async function fetchJSON(url) {
    try {
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


function check_current(timespan, quest_log, userID) {
    const obj_currentDate = new Date();
    let lastestDate;
    switch (timespan) {
        case 'daily': {
            const obj_dailies = quest_log[userID][timespan];
            lastestDate = Object.keys(obj_dailies)[Object.keys(obj_dailies).length - 1];
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
            lastestDate = Object.keys(obj_weeklies)[Object.keys(obj_weeklies).length - 1];
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
            lastestDate = Object.keys(obj_monthlies)[Object.keys(obj_monthlies).length - 1];
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



function add_quest_json(quest) {
    fetch('http://127.0.0.1:3366/write_quest_json', { //Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node or http://127.0.0.1:3366
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
                    obj_Quest = modify_quest(obj_Quest, 3, difficulty, 6, questTimespan);
                    obj_newQuest = new Object;
                    obj_currentDate = new Date;
                    const date = obj_currentDate.getDate() + '/' + (obj_currentDate.getMonth() + 1) + '/' + obj_currentDate.getFullYear();

                    obj_newQuest[date] = {};
                    obj_newQuest[date].type = type;
                    obj_newQuest[date].target = obj_Quest["base_target"];
                    obj_newQuest[date].amount = 0;
                    obj_newQuest[date].text = obj_Quest.quest_text;
                    obj_newQuest[date].state = "incomplete";
                    obj_newQuest.timespan = questTimespan;

                    add_quest_json(obj_newQuest);
                    document.getElementById("myModal").style.display = "none";
                    location.reload();
                });

        });
    })

}

function display_quest(quest, userInfox, user) {
    const timespans = ["daily", "weekly", "monthly"];
    let questTimespan = timespans[quest[5] - 1];
    fetchJSON('json/quest_log.json')
        .then(quest_log => {
            const stateQuest = check_current(questTimespan, quest_log, user);
            if (stateQuest == "None") {
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


            } else if (stateQuest == "Done") {
                document.getElementById(quest + "_type").innerText = "Quest done";
                //Add progressbars
            } else {
                const vaules = quest_log[user][questTimespan][stateQuest];
                document.getElementById(quest + "_type").innerText = "Type: " + vaules.type + "\n" + vaules.text + "\nYou have done " + vaules.amount + " out of " + vaules.target;
            }

            //Add progressbar

        })

}




display_quest("quest1", "Add User Json Here", "assholeblaster69");
display_quest("quest2", "Add User Json Here", "assholeblaster69");
display_quest("quest3", "Add User Json Here", "assholeblaster69");


