
/**
 * A function which returns a number between 0 and Max
 * @param {max vaule for number} max 
 * @returns A number between 0 and max
 */
function generate_random_number(max) {
    return Math.floor(Math.random() * max);
}


/**
 * Takes an obj and returns a random object key
 * @param {An obj} quests 
 * @returns An obj with a random quest, and the exercise 
 */
function choose_quest(quests) {
    console.log(quests)
    const quest = new Object;
    const random = generate_random_number(Object.keys(quests).length);
    quest.quest = quests[Object.keys(quests)[random]];
    quest.exercise = Object.keys(quests)[random];
    return quest;
}

/**
 * Checks if an obj is empty
 * @param {obj} obj 
 * @returns True if obj is empty
 */
function is_empty_object(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Modify a given quest and inserts the target into the text
 * @param {An obj for a quest} quest 
 * @param {The users rank} rank 
 * @param {The choosen difficulty} difficulty 
 * @param {The users mastery} mastery 
 * @param {The timespan of the quest} timespan 
 * @returns A obj mostifed basend on the parameters
 */
function modify_quest(quest, rank, difficulty, mastery, timespan) {
    console.log(quest);
    const min = quest["base_target"];
    //Modify the quest based on timesapan
    switch (timespan) {
        case 'daily':
            quest["base_target"] = Math.floor(quest["base_target"] * ((rank + parseInt(difficulty)) * 0.5) * (mastery * 0.5));
            break;
        case 'weekly':
            quest["base_target"] = Math.floor(quest["base_target"] * ((rank + parseInt(difficulty)) * 0.5) * (mastery * 0.5) * 4);
            break;
        case 'monthly':
            quest["base_target"] = Math.floor(quest["base_target"] * ((rank + parseInt(difficulty)) * 0.5) * (mastery * 0.5) * 13);
            break;
    }
    //Ensures the new target isn't lower than base target
    if (quest["base_target"] < min) {
        quest["base_target"] = min
        quest["quest_text"] = quest["quest_text"].replace("x", quest["base_target"])
        return quest;
    }
   
    quest["quest_text"] = quest["quest_text"].replace("x", quest["base_target"])
    return quest;
}

/**
 * Fetches a Json file
 * @param {Path to Json file} url 
 * @returns Json file as js object
 */
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

/**
 * Checks the sate of the current quest
 * @param {Timespan of quest} timespan 
 * @param {The quest_log} quest_log 
 * @param {The usersID} userID 
 * @returns An obj of with the state of the quest and date of the newest quest if a 
 * current quest exists else date is the current date 
 */
function check_current(timespan, quest_log, userID) {
    const obj_currentDate = new Date();
    let lastestDate;
    let obj_state = {}
    switch (timespan) {
        case 'daily': {
            const obj_dailies = quest_log[userID][timespan];
            //Checks if there exists any quest
            if (is_empty_object(obj_dailies)) {
                obj_state.state = "None";
                obj_state.date = get_current_date_format();
                return obj_state;
            }
            //Gets the latest entry by taking the last key
            lastestDate = Object.keys(obj_dailies)[Object.keys(obj_dailies).length - 1];
            obj_state.date = lastestDate;
            const questDate = lastestDate.split("/");
            //Check if latest quest is the same date as today
            if (questDate[0] == obj_currentDate.getDate() && questDate[1] == (obj_currentDate.getMonth() + 1) && questDate[2] == obj_currentDate.getFullYear()) {
                //If the current quest is active, check if the quest is done
                if (obj_dailies[lastestDate]["target"] <= obj_dailies[lastestDate]["amount"]) {
                    obj_state.state = "Done";
                    return obj_state;
                }
                return obj_state;
            }
        }
            obj_state.state = "None";
            return obj_state;

        case 'weekly':
            const obj_weeklies = quest_log[userID][timespan];
            //Check if the object is empty
            if (is_empty_object(obj_weeklies)) {
                obj_state.state = "None";
                obj_state.date = get_current_date_format();
                return obj_state;
            }
            //Gets the latest quest
            lastestDate = Object.keys(obj_weeklies)[Object.keys(obj_weeklies).length - 1];
            obj_state.date = lastestDate;
            const questDateStr = lastestDate.split("/");
            //Check if latest quest is within 7 days of today
            const questDateObj = new Date(questDateStr[2], questDateStr[1] - 1, questDateStr[0]);
            //Difference in milisec
            let diffInMilisec = obj_currentDate - questDateObj;
            //Convert to day
            let diffInDays = diffInMilisec / (1000 * 60 * 60 * 24)

            //If the difference is less then or equel to 7 the quest is still active
            if (Math.abs(diffInDays) <= 7) {
                //Check if quest is complete
                if (obj_weeklies[lastestDate]["target"] <= obj_weeklies[lastestDate]["amount"]) {
                    obj_state.state = "Done";
                    return obj_state;
                }
                return obj_state;
            }
            obj_state.state = "None";
            return obj_state;

        case 'monthly':
            const obj_monthlies = quest_log[userID][timespan];
            //Checks if the obj is empty
            if (is_empty_object(obj_monthlies)) {
                obj_state.state = "None";
                obj_state.date = get_current_date_format();
                return obj_state;
            }
            //Get lastest quest
            lastestDate = Object.keys(obj_monthlies)[Object.keys(obj_monthlies).length - 1];
            obj_state.date = lastestDate;
            const questDate = lastestDate.split("/");
            //Check if quest is in the same month as current month
            if ((obj_currentDate.getMonth() + 1) == questDate[1] && obj_currentDate.getFullYear() == questDate[2]) {
                //If the quest is active check if it is done
                if (obj_monthlies[lastestDate]["target"] <= obj_monthlies[lastestDate]["amount"]) {
                    obj_state.state = "Done";
                    return obj_state;
                }
                return obj_state;
            }
            obj_state.state = "None";
            return obj_state;
        default:
            return "Fail"


    }
}


/**
 * Add the quest to quest_log json file
 * @param {ojb containg the quest} quest 
 */
function add_quest_json(quest) {
    fetch(serverPath + 'write_quest_json', { //Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node or http://127.0.0.1:3366
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
            return response.text();
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

    //Adds functionality to each difficulty button
    document.querySelectorAll(".difficulty-button").forEach(difficultyButton => {
        difficultyButton.addEventListener("click", (event) => {
            //Gets the difficulty of the button
            const difficulty = event.target.dataset.difficulty;
            fetchJSON('json/quest_templates.json')
                .then(data => {
                    function get_overkey(type){
                        for (const category in data.quest_templates) {
                            if (data.quest_templates[category][type]) {
                                return category;
                              }
                          }
                          return null; // Exercise not found in any category
                    }
                    console.log("Dav");
                    //Gets a quest out of quest_template
                    //TODO, Uncomment when tobi fix
                    let obj_Quest = choose_quest(data.quest_templates[type]);
                    //Modify the quest
                    
                    obj_Quest.quest = modify_quest(obj_Quest.quest, 3, difficulty, 6, questTimespan);
                    obj_newQuest = new Object;
                    const date = get_current_date_format();
                    //Make an obj which is used when adding the quest
                    obj_newQuest[date] = {};
                    obj_newQuest[date].type = type;
                    obj_newQuest[date].target = obj_Quest.quest["base_target"];
                    obj_newQuest[date].amount = 0;
                    obj_newQuest[date].text = obj_Quest.quest.quest_text;
                    obj_newQuest[date].state = "incomplete";
                    obj_newQuest[date].exercise = obj_Quest.exercise;
                    obj_newQuest.timespan = questTimespan;
                    obj_newQuest.userID = user;

                    //Add quest to json file
                    add_quest_json(obj_newQuest);
                    //remove popup window
                    document.getElementById("myModal").style.display = "none";
                    //Reload the page
                    location.reload();
                });

        });
    })
    //add functionality to close button
    document.getElementById("close").addEventListener("click", () => {
        document.getElementById("myModal").style.display = "none";
    });

}

/**
 * A function that changes the amount for a done for a quest
 * @param {an object which contain parameters for change amount function} obj_para 
 */
function change_amount(obj_para) {
    fetch(serverPath + 'change_amount', { //Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node or http://127.0.0.1:3366
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
/**
 * Validates a string such thats is a number
 * @param {a string} value 
 * @returns True if vaule is valid
 */
function validate_input(value) {
    //Insures the input is a string only containg numbers
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

/**
 * A function for opening a popup window, and lets the user add or substract from amount done
 * @param {an obj which contains parameters, used when chaning the amount} obj_para 
 */
function input_data(obj_para) {
    //show popup
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

/**
 * Makes the edit button
 * @param {An obj cointing parameters, such as QuestID} obj_para 
 */
function add_edit_button(obj_para) {
    //Creates an image in the lower corner of given quest
    const image = document.createElement("img");
    image.src = "image/edit_button.png";
    image.width = 50;
    image.height = 50;
    image.style.position = 'absolute';
    image.style.bottom = '10px';
    image.style.right = '10px';

    image.addEventListener('click', input_data.bind(null, obj_para));

    //Add the image in the the quest boxed based on questID from obj_para
    const questContainer = document.getElementById(obj_para["questID"]);
    questContainer.style.position = 'relative';
    questContainer.appendChild(image);

}

/**
 * Updates the meter
 * @param {Quest ID} ID 
 * @param {obj cointing the quest} obj_quest 
 */
function update_meter(ID, obj_quest) {
    const meter = document.getElementById("meter" + ID);
    meter.max = obj_quest.target;
    meter.value = obj_quest.amount;

}


/**
 * Choose a type based on a weighted obj
 * @param {an obj with weighted keys} obj_conf 
 * @returns A type
 */
function get_type(obj_conf) {
    //Array for weightedKeys
    let weightedKeys = [];

    //Loop though each key
    for (let key in obj_conf) {
        for (let i = 0; i < obj_conf[key]; i++) {
            weightedKeys.push(key);
        }
    }
    return weightedKeys[generate_random_number(weightedKeys.length)];

}


/**
 * Display the quest
 * @param {questID} quest 
 * @param {userinfo} userInfox 
 * @param {username} user 
 */
async function display_quest(quest, user) {
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
                //Check the state of quest
                const obj_stateQuest = check_current(questTimespan, quest_log, user);
                //If there is no quest
                if (obj_stateQuest["state"] == "None") {
                    //Chooses a type for userInfo
                    fetchJSON('json/users_info.json')
                        .then(userInfo => {
                            const type = get_type(userInfo.users_info[user].preset["conf"]);
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
                        })







                } else if (obj_stateQuest["state"] == "Done") {
                    //If quest is done
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

                    //Show meter and update it
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
async function display_all_quest(user) {
    try {
        //Display the daily quest
        await display_quest("quest1", user);
        //Display the weekly quest
        await display_quest("quest2", user);
        //Display the monthly quest
        await display_quest("quest3", user);

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
