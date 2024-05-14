try {
    const userx = localStorage.getItem('username');
    if (typeof userx !== 'undefined') {
        display_all_quest(userx);
    }
    else {
        console.log("User not logged in");
        document.getElementById("quest1_type").innerText = "Please, login";
        document.getElementById("quest1_type").innerText = "Please, login";
        document.getElementById("quest1_type").innerText = "Please, login";
    }

} catch (error) {
    document.getElementById("quest1_type").innerText = "Error, please reload site";
    document.getElementById("quest1_type").innerText = "Error, please reload site";
    document.getElementById("quest1_type").innerText = "Error, please reload site";
}


/**
 * Displayes all the quest
 * @param {string} user - UserID 
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

/**
 * Display the quest
 * @param {string} quest - Quest ID 
 * @param {string} user - User ID
 */
async function display_quest(quest, user) {
    return new Promise((resolve) => {
        //Based on ID figure out the timespan
        const timespans = ["daily", "weekly", "monthly"];
        const questTimespan = timespans[quest[5] - 1];

        /**
         * Makes a new quest
         * @param {the type of the current quest} type 
         */
        function new_quest(type) {
            const questContainer = document.getElementById(quest);
            // Create button
            const button = document.createElement("button");
            button.textContent = "Get new Quest!";
            button.id = questTimespan;
            button.classList.add("asphalt-button");

            //Size
            button.style.width = "80%"
            button.style.height = "10%"

            // Position button
            button.style.position = "absolute";
            button.style.bottom = "5%"; // Adjust as needed
            button.style.left = "50%";
            button.style.transform = "translateX(-50%)";

            // Add event listeners
            button.addEventListener('mouseover', function () {
                // Change the text content when hovered
                this.textContent = "Type: " + type;
            });
            button.addEventListener('mouseout', function () {
                // Change the text content back to original when not hovered
                this.textContent = 'Get new Quest!';
            });

            // Create gif
            const gif = document.createElement("img");
            gif.src = "gif/" + type + ".gif";
            gif.style.width = "80%";
            gif.style.height = "48%";
            gif.style.position = "absolute";
            gif.style.bottom = "15%";
            gif.style.left = "50%";
            gif.style.transform = "translateX(-50%)";

            // Append elements to questContainer
            questContainer.style.position = 'relative';
            questContainer.appendChild(gif);
            questContainer.appendChild(button);

            //Add event listner to button
            button.addEventListener("click", () => {
                open_modal_for_quest(questTimespan, type, user);
            });
        }

        //Fetch quest_log
        fetchJSON('json/quest_log.json')
            .then(quest_log => {
                //Check the state of quest
                const obj_stateQuest = check_current(questTimespan, quest_log[user]);
                //If there is no quest
                if (obj_stateQuest["state"] == "None") {
                    //Check if they completed last quest
                    try {   
                        const lastestQuestDate = Object.keys(quest_log[user][questTimespan])[Object.keys(quest_log[user][questTimespan]).length-1];
                        const stateOfLastQuest = quest_log[user][questTimespan][lastestQuestDate].state;
                        if (stateOfLastQuest === "incomplete"){
                            const obj_para = {
                                user: user,
                                type: quest_log[user][questTimespan][lastestQuestDate].exercise,
                                timespan: questTimespan,
                                date: lastestQuestDate
                            };
                            remove_elo(obj_para);
                            location.reload();
                        }
                    } catch (error) {
                        //If there exit a prevous quest console the error
                        if (Object.keys(quest_log[user][questTimespan]) > 0){
                            console.error(error);
                        }
                        
                    }
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

                    //Change Json and add rewards
                    const pathQuest = quest_log[user][questTimespan][obj_stateQuest.date];
                    if ("incomplete" === pathQuest.state) {
                        let obj_award = {};
                        obj_award.user = user;
                        obj_award.timespan = questTimespan;
                        obj_award.date = obj_stateQuest.date;
                        obj_award.difficulty = pathQuest.difficulty;
                        obj_award.type = pathQuest.exercise;
                        award_elo(obj_award);
                        location.reload();
                    }

                    // Visual part
                    // Change Caption
                    const capitalizedQuestTimespan = questTimespan.charAt(0).toUpperCase() + questTimespan.slice(1);
                    document.getElementById(quest).querySelector('h2').innerText = capitalizedQuestTimespan + " - Complete";

                    // Add text
                    const values = quest_log[user][questTimespan][obj_stateQuest["date"]];
                    document.getElementById(quest + "_type").innerText = "Type: " + values.type + "\n" + values.text + "\nYou have done " + values.amount + " out of " + values.target;

                    // Add percentage completion
                    const procentElement = document.createElement("h3");
                    let procentComplete = Math.floor(quest_log[user][questTimespan][obj_stateQuest.date].amount / quest_log[user][questTimespan][obj_stateQuest.date].target * 100);


                    const min = 100;
                    const max = 1000;

                    // Handle completion percentages greater than or equal to 1000
                    let color;
                    if (procentComplete >= 1000) {
                        color = lerpColor("#00FF00", "#8B0000", (max - min) / (max - min));
                        procentComplete = "&ge; 1000";
                    } else {
                        color = lerpColor("#00FF00", "#8B0000", (procentComplete - min) / (max - min));
                    }
                    procentElement.innerHTML = procentComplete + "%";                    

                    procentElement.style.fontSize = 50 + "px";
                    procentElement.style.color = color;

                    document.getElementById(quest).append(procentElement);5
                    // Function for color interpolation
                    function lerpColor(a, b, t) {
                        const min = 100;
                        const max = 1000;

                        const ah = parseInt(a.replace(/#/g, ""), 16),
                            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
                            bh = parseInt(b.replace(/#/g, ""), 16),
                            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
                            rr = ar + t * (br - ar),
                            rg = ag + t * (bg - ag),
                            rb = ab + t * (bb - ab);

                        return "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
                    }

                    //Makes obj with parametes for other functions
                    const obj_para = {
                        questID: quest,
                        timespan: questTimespan,
                        date: obj_stateQuest["date"],
                        user: user
                    };
                    add_edit_button(obj_para);
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
                    update_meter(quest[5], vaules);
                    resolve();

                }
            })
    })
}

/**
 * Fetches a Json file
 * @param {string} url - Path to Json file
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
 * Open a popup window where the user can choose diffuclty
 * @param {string} questTimespan - The timespan of the quest
 * @param {string} type - The type of quest 
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
                    //Gets a quest out of quest_template
                    let obj_Quest = choose_quest(data.quest_templates[type]);

                    fetchJSON('json/users_info.json')
                        .then(userInfo => {
                            //Modify the quest
                            obj_Quest.quest = modify_quest(obj_Quest.quest, userInfo.users_info[user].tier[questTimespan].rank, difficulty, userInfo.users_info[user].mastery[obj_Quest.exercise].rank, questTimespan);
                            let obj_newQuest = new Object;
                            const date = get_current_date_format();

                            //Make an obj which is used when adding the quest
                            obj_newQuest[date] = new Object;
                            obj_newQuest[date].type = type;
                            obj_newQuest[date].difficulty = difficulty;
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
                        })
                });
        });
    })
    //add functionality to close button
    document.getElementById("close").addEventListener("click", () => {
        document.getElementById("myModal").style.display = "none";
    });
}

/**
 * Checks the sate of the current quest
 * @param {string} timespan - Timespan of the quest
 * @param {object} usersQuest - A users quest log
 * @returns An obj of with the state of the quest and date of the newest quest if a 
 * current quest exists else date is the current date 
 */
function check_current(timespan, usersQuest) {
    const obj_currentDate = new Date();
    let lastestDate;
    let obj_state = {};
    let questDateArr = [];
    switch (timespan) {
        case 'daily': {
            const obj_dailies = usersQuest[timespan];
            //Checks if there exists any quest
            if (is_empty_object(obj_dailies)) {
                obj_state.state = "None";
                obj_state.date = get_current_date_format();
                return obj_state;
            }
            //Gets the latest entry by taking the last key
            lastestDate = Object.keys(obj_dailies)[Object.keys(obj_dailies).length - 1];
            obj_state.date = lastestDate;
            questDateArr = lastestDate.split("/");
            //Check if latest quest is the same date as today
            if (questDateArr[0] == obj_currentDate.getDate() && questDateArr[1] == (obj_currentDate.getMonth() + 1) && questDateArr[2] == obj_currentDate.getFullYear()) {
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
            const obj_weeklies = usersQuest[timespan];
            //Check if the object is empty
            if (is_empty_object(obj_weeklies)) {
                obj_state.state = "None";
                obj_state.date = get_current_date_format();
                return obj_state;
            }
            //Gets the latest quest
            lastestDate = Object.keys(obj_weeklies)[Object.keys(obj_weeklies).length - 1];
            obj_state.date = lastestDate;
            questDateArr = lastestDate.split("/");
            //Check if latest quest is within 7 days of today
            const obj_questDate = new Date(questDateArr[2], questDateArr[1] - 1, questDateArr[0]);
            //Difference in milisec
            let diffInMilisec = obj_currentDate - obj_questDate;
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
            const obj_monthlies = usersQuest[timespan];
            //Checks if the obj is empty
            if (is_empty_object(obj_monthlies)) {
                obj_state.state = "None";
                obj_state.date = get_current_date_format();
                return obj_state;
            }
            //Get lastest quest
            lastestDate = Object.keys(obj_monthlies)[Object.keys(obj_monthlies).length - 1];
            obj_state.date = lastestDate;
            questDateArr = lastestDate.split("/");
            //Check if quest is in the same month as current month
            if ((obj_currentDate.getMonth() + 1) == questDateArr[1] && obj_currentDate.getFullYear() == questDateArr[2]) {
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
            console.error("Failed to check current state of" + timespan);
            return "Fail"
    }
}

/**
 * Takes an obj and returns a random object key
 * @param {object} quests 
 * @returns An obj with a random quest, and the exercise 
 */
function choose_quest(quests) {
    const quest = new Object;
    const random = generate_random_number(Object.keys(quests).length);
    quest.quest = quests[Object.keys(quests)[random]];
    quest.exercise = Object.keys(quests)[random];
    return quest;
}

/**
 * Modify a given quest and inserts the target into the text
 * @param {object} quest - The quest object
 * @param {int} quest.base_target - The base target of the quest
 * @param {string} quest.quest_text - The text for quest
 * @param {int} rank - The users rank 
 * @param {int} difficulty - The choosen diffuculty 
 * @param {int} mastery - The users mastery level, in the given quest 
 * @param {string} timespan - Time span of quest 
 * @returns A obj mostifed basend on the parameters
 */
function modify_quest(quest, rank, difficulty, mastery, timespan) {
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
        quest["quest_text"] = quest["quest_text"].replace("${base_target}", quest["base_target"])
        return quest;
    }

    quest["quest_text"] = quest["quest_text"].replace("${base_target}", quest["base_target"])
    return quest;
}


/**
 * Add the quest to quest_log json file
 * @param {object} quest - An object cointaining the quest
 * @param {string} quest.timespan - The quest timespan
 * @param {string} quest.userID - The users ID
 * @param {object} quest.date - An object with the key name of the quest name, 
 * everything in this object will be saved in the json file
 */
function add_quest_json(quest) {
    fetch(serverPath + 'write_quest_json', {
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
 * A function that changes the amount for a done for a quest
 * @param {object} obj_para - An object containg relevent parameters
 * @param {string} obj_para.questID - The quests ID
 * @param {string} obj_para.timespan - The quest timespan
 * @param {string} obj_para.date - The date of the quest
 * @param {string} obj_para.user - The user id
 * @param {string} obj_para.mode - Either add or sub
 */
function change_amount(obj_para) {
    fetch(serverPath + 'change_amount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj_para)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No response fetch POST Change_Amount');
            }
        })
        .catch(error => {
            console.error('Error fetch Post (change amount):', error);
        });
}

/**
 * Removes elo from user
 * @param {object} obj_para
 * @param {string} obj_para.user - User ID
 * @param {string} obj_para.type - The type of exercise
 * @param {string} obj_para.timesapan - The timespan of quest
 * @param {string} obj_para.date - The date of failed quest 
 */
function remove_elo(obj_para){
    fetch(serverPath + 'remove_elo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj_para)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No response fetch POST remove elo');
            }
        })
        .catch(error => {
            console.error('Error fetch Post (remove_elo):', error);
        });
}

/**
 * Adds elo to user
 * @param {object} obj_para
 * @param {string} obj_para.user - User ID
 * @param {string} obj_para.timespan - Quest Type
 * @param {string} obj_para.date - Date of quest
 * @param {int} obj_para.difficulty - The difficulty of quest esay(-3), medium(0), hard(3) 
 * @param {string} obj_para.type - The type of exercise
 */
function award_elo(obj_para) {
    fetch(serverPath + 'award_elo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj_para)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No response fetch POST award Elo');
            }
        })
        .catch(error => {
            console.error('Error fetch Post (award_elo):', error);
        });
}


/**
 * Makes the edit button
 * @param {object} obj_para - An object containg relevent parameters
 * @param {string} obj.para.questID - The quests ID
 * @param {string} obj.para.timespan - The quest timespan
 * @param {string} obj.para.date - The date of the quest
 * @param {string} obj.para.user - the user id
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
 * A function for opening a popup window, and lets the user add or substract from amount done
 * @param {object} obj_para - An object containg relevent parameters
 * @param {string} obj.para.questID - The quests ID
 * @param {string} obj.para.timespan - The quest timespan
 * @param {string} obj.para.date - The date of the quest
 * @param {string} obj.para.user - the user id
 */
function input_data(obj_para) {
    //show popup
    document.getElementById("inputModal").style.display = "block";
    const inputField = document.getElementById("InputInputfield");
    document.getElementById("InputHeader").innerText = obj_para["timespan"].charAt(0).toUpperCase() + obj_para["timespan"].slice(1);
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
 * Updates the meter
 * @param {string} ID - Quest ID
 * @param {object} obj_quest - object cointing the quest
 */
function update_meter(ID, obj_quest) {
    const meter = document.getElementById("meter" + ID);
    meter.max = obj_quest.target;
    meter.value = obj_quest.amount;

}

/**
 * Choose a type based on a weighted obj
 * @param {object} obj_conf - an obj with weighted keys
 * @returns {string} A type
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
 * Validates a string such thats is a number
 * @param {string} value 
 * @returns {boolean} True if value is a string contstion of only integers
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
 * Get the current date and transform it to date/month/year format
 * @returns {string} A string with  date/month/year
 */
function get_current_date_format() {
    obj_currentDate = new Date;
    return obj_currentDate.getDate() + '/' + (obj_currentDate.getMonth() + 1) + '/' + obj_currentDate.getFullYear();
}

/**
 * A function which returns a number between 0 and Max
 * @param {int} max - max vaule for randomnumber 
 * @returns {int} A number between 0 and max
 */
function generate_random_number(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Checks if an obj is empty
 * @param {object} obj 
 * @returns True if obj is empty
 */
function is_empty_object(obj) {
    return Object.keys(obj).length === 0;
}