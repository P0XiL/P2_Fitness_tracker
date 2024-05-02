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

function is_empty_object(obj) {
    return Object.keys(obj).length === 0;
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

    if (quest["base_target"] < min) {
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
    let obj_state = {}
    switch (timespan) {
        case 'daily': {
            const obj_dailies = quest_log[userID][timespan];
            if (is_empty_object(obj_dailies)) {
                obj_state.state = "None";
                return obj_state;
            }
            lastestDate = Object.keys(obj_dailies)[Object.keys(obj_dailies).length - 1];
            const questDate = lastestDate.split("/");
            if (questDate[0] == obj_currentDate.getDate() && questDate[1] == (obj_currentDate.getMonth() + 1) && questDate[2] == obj_currentDate.getFullYear()) {
                if (obj_dailies[lastestDate]["target"] <= obj_dailies[lastestDate]["amount"]) {
                    obj_state.state = "Done";
                    obj_state.date = lastestDate;
                    return obj_state;
                }
                obj_state.date = lastestDate;
                return obj_state;
            }
        }
            obj_state.state = "None";
            return obj_state;

        case 'weekly':
            const obj_weeklies = quest_log[userID][timespan];
            if (is_empty_object(obj_weeklies)) {
                obj_state.state = "None";
                return obj_state;
            }
            lastestDate = Object.keys(obj_weeklies)[Object.keys(obj_weeklies).length - 1];
            const questDateStr = lastestDate.split("/");
            //Check if questDay is within 7 days of today
            let questDateObj = new Date(questDateStr[2], questDateStr[1] - 1, questDateStr[0]);
            //Difference in milisec
            diffInMilisec = obj_currentDate - questDateObj;
            //Convert to day
            let diffInDays = diffInMilisec / (1000 * 60 * 60 * 24)


            if (Math.abs(diffInDays) <= 7) {
                if (obj_weeklies[lastestDate]["target"] <= obj_weeklies[lastestDate]["amount"]) {
                    obj_state.state = "Done";
                    obj_state.date = lastestDate;
                    return obj_state;
                }
                obj_state.date = lastestDate;
                return obj_state;
            }
            obj_state.state = "None";
            return obj_state;

        case 'monthly':
            const obj_monthlies = quest_log[userID][timespan];
            if (is_empty_object(obj_monthlies)) {
                obj_state.state = "None";
                return obj_state;
            }
            lastestDate = Object.keys(obj_monthlies)[Object.keys(obj_monthlies).length - 1];
            const questDate = lastestDate.split("/");
            if ((obj_currentDate.getMonth() + 1) == questDate[1] && obj_currentDate.getFullYear() == questDate[2]) {
                if (obj_monthlies[lastestDate]["target"] <= obj_monthlies[lastestDate]["amount"]) {
                    obj_state.state = "Done";
                    obj_state.date = lastestDate;
                    return obj_state;
                }
                obj_state.date = lastestDate;
                return obj_state;
            }
            obj_state.state = "None";
            return obj_state;
        default:
            return "Fail"


    }


}



function add_quest_json(quest) {
    fetch('http://127.0.0.1:3360/write_quest_json', { //Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node or http://127.0.0.1:3366
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

/**
 * Get the current date and transform it to date/month/year format
 * @returns A string with  date/month/year
 */
function get_current_date_format() {
    obj_currentDate = new Date;
    return obj_currentDate.getDate() + '/' + (obj_currentDate.getMonth() + 1) + '/' + obj_currentDate.getFullYear();
}

/**
 * Open a popup window where the user can choose diffuclty
 * @param {the timespan of quest} questTimespan 
 * @param {the type of the quest} type 
 */
function open_modal_for_quest(questTimespan, type, user) {
    //Makke the popup visable
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
                    obj_newQuest.userID = user;

                    //Add quest to json file
                    add_quest_json(obj_newQuest);
                    document.getElementById("myModal").style.display = "none";
                    location.reload();
                });

        });
    })

}


function change_amount(obj_para) {
    fetch('http://127.0.0.1:3360/change_amount', { //Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node or http://127.0.0.1:3366
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj_para)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No response fetch POST amount');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetch Post (change amount):', error);
        });
}





//validates a value such that the vaule is a posetiv number
function validate_input(value) {
    //insures the input is a string only containg numbers
    if (/^\d+$/.test(value) && parseFloat(value) > 0) {
        return true
    } else if (parseFloat(value) <= 0) {
        alert("Please enter a posetiv number");
        return false
    } else {
        alert("Please enter a valid number");
        return false
    }
}

function input_data(obj_para) {
    document.getElementById("inputModal").style.display = "block";
    const inputField = document.getElementById("InputInputfield");
    document.getElementById("InputHeader").innerText = obj_para["timespan"].charAt(0).toUpperCase() + obj_para["timespan"].slice(1);
    document.getElementById("InputPopupText").innerText = "Enter a number below to change the amount done";
    //Functions for add button
    document.getElementById("add").addEventListener("click", () => {
        if (validate_input(inputField.value)) {
            obj_para.amount = parseInt(inputField.value);
            obj_para.mode = "add";
            change_amount(obj_para);

            inputField.value = ""
            document.getElementById("inputModal").style.display = "none";
            location.reload();
        }
        inputField.value = ""
    });

    //Functions for subtract button
    document.getElementById("subtract").addEventListener("click", () => {
        if (validate_input(inputField.value)) {
            obj_para.amount = parseInt(inputField.value);
            obj_para.mode = "sub";
            change_amount(obj_para);

            inputField.value = ""
            document.getElementById("inputModal").style.display = "none";
            location.reload();
        }
        inputField.value = ""
    });

    //Functions for close button
    document.getElementById("close_input").addEventListener("click", () => {
        inputField.value = ""
        document.getElementById("inputModal").style.display = "none";
    });


}

function add_edit_button(obj_para) {
    //obj_quest.timespanID = questID;

    const image = document.createElement("img");
    image.src = "image/edit_button.png";
    image.width = 50;
    image.height = 50;
    image.style.position = 'absolute';
    image.style.bottom = '10px';
    image.style.right = '10px';

    image.addEventListener('click', input_data.bind(null, obj_para));

    const questContainer = document.getElementById(obj_para["questID"]);
    questContainer.style.position = 'relative';
    questContainer.appendChild(image);

}


function update_meter(ID, obj_quest) {
    const meter = document.getElementById("meter" + ID);
    meter.max = obj_quest.target;
    meter.value = obj_quest.amount;

}

/**
 * Display the quest
 * @param {questID} quest 
 * @param {userinfo} userInfox 
 * @param {username} user 
 */
async function display_quest(quest, userInfox, user) {
    return new Promise((resolve, reject) => {
    //Based on ID figure out the timespan
    const timespans = ["daily", "weekly", "monthly"];
    const questTimespan = timespans[quest[5] - 1];

    /**
     * Makes a new quest
     * @param {the type of the current quest} type 
     */
    function new_quest(type) {
        document.getElementById(quest + "_type").innerText = "Type: " + type;

        //Create button
        const button = document.createElement("button");
        button.textContent = "Get new Quest!";
        button.id = questTimespan;

        //Append button
        document.getElementById(quest + "_type").appendChild(button)

        //Add event listner to button
        button.addEventListener("click", () => {
            open_modal_for_quest(questTimespan, type, user);
        });
    }

    //Fetch quest_log
    fetchJSON('json/quest_log.json')
        .then(quest_log => {
            const obj_stateQuest = check_current(questTimespan, quest_log, user);

            //If there is no quest
            if (obj_stateQuest["state"] == "None") {
                //Chooses a type for userInfo
                const type = userInfo["preset"][generate_random_number(userInfo["preset"].length)];

                //Makes a obj with info for new quest
                const date = get_current_date_format();
                let obj_newQuest = {};
                obj_newQuest[date] = {};
                obj_newQuest[date].type = type;
                obj_newQuest.timespan = questTimespan;
                obj_newQuest.userID = user;
                //Adds the type to Json file
                add_quest_json(obj_newQuest);
                //Make the new quest button appear
                new_quest(type);
                resolve();
                return;


            } else if (obj_stateQuest["state"] == "Done") {

                document.getElementById(quest + "_type").innerText = "Quest done";
                resolve();
                return;
            } else {
                //If a quest is ongoing

                //if only a type for the quest exits make a new quest
                if (Object.keys(quest_log[user][questTimespan][obj_stateQuest["date"]]).length < 2) {
                    new_quest(quest_log[user][questTimespan][obj_stateQuest["date"]]["type"]);
                    resolve();
                    return;
                }

                //Makes obj with parametes for other functions
                const obj_para = {
                    questID: quest,
                    timespan: questTimespan,
                    date: obj_stateQuest["date"],
                    user: user
                };

                //Add edit button
                add_edit_button(obj_para);
                const vaules = quest_log[user][questTimespan][obj_stateQuest["date"]];
                document.getElementById(quest + "_type").innerText = "Type: " + vaules.type + "\n" + vaules.text + "\nYou have done " + vaules.amount + " out of " + vaules.target;

                document.getElementById("meter" + quest[5]).style.display = "block"
                update_meter(quest[5], quest_log[user][questTimespan][obj_stateQuest["date"]]);
                resolve();

            }
        })
    })

}






//example of output
userInfo = {
    rank: generate_random_number(43),
    mastery: generate_random_number(3),
    preset: ["cardio", "cardio", "cardio", "core", "core", "upperbody", "lowerbody"],
};
/**
 * Displayes all the quest
 * @param {userID} user 
 */
async function display_all_quest(user){
    try {
        //Display the daily quest
        await display_quest("quest1", "Add User Json Here", user);
        //Display the weekly quest
        await display_quest("quest2", "Add User Json Here", user);
        //Display the monthly quest
        await display_quest("quest3", "Add User Json Here", user);
        
    } catch (error) {
        console.error("Error displaing quests:", error);
    }
}

try {
    const userx = localStorage.getItem('username');
    display_all_quest(userx);

} catch (error) {
    console.log("User not logged in");
    document.getElementById("quest1_type").innerText = "Please login"
    document.getElementById("quest1_type").innerText = "Please login"
    document.getElementById("quest1_type").innerText = "Please login"
}


