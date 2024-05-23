//Insure dates are correct
const quest_log_QuestTest = {
    "daily": {
        "22/5/2024": {
            "type": "upperbody",
            "difficulty": "0",
            "target": 10,
            "amount": 0,
            "text": "Do arm circles for 10 seconds",
            "state": "incomplete",
            "exercise": "armcircles"
        }
    },
    "weekly": {
        "16/5/2024": {
            "type": "cardio",
            "difficulty": "3",
            "target": 20,
            "amount": 456,
            "text": "Cycle 20 minutes",
            "state": "complete",
            "exercise": "cycling"
        }
    },
    "monthly": {}
};
runTestsQuest();
function runTestsQuest() {
    try {
        console.log("Running tests for quest_creation...");
        test_fetchJSON();
        test_check_currrent();
        test_modify_quest();
        test_get_type();
        test_validate_input();
        test_generate_random_number();
        test_is_empty_object();
        test_get_current_date_format();
        console.log("All tests for quest_creation passed");  
    } catch (error) {
        console.error("Error occurred during testing:", error);  
    }
}

// Assertion function
function assert(condition, message) {
    if (!condition) {
        console.error("Assertion failed:", message);
    }
}

function test_fetchJSON() {
    const questTemplates = {
        "quest_templates": {
            "cardio": {
                "run": {
                    "base_target": 5,
                    "quest_text": "Go for a run for ${base_target} minutes"
                },
                "walk": {
                    "base_target": 5,
                    "quest_text": "Go for a walk for ${base_target} minutes"
                },
                "cycling": {
                    "base_target": 5,
                    "quest_text": "Cycle ${base_target} minutes"
                }
            },
            "lowerbody": {
                "squats": {
                    "base_target": 3,
                    "quest_text": "Do ${base_target} squats"
                },
                "lunges": {
                    "base_target": 3,
                    "quest_text": "Do ${base_target} lunges"
                },
                "wallsit": {
                    "base_target": 10,
                    "quest_text": "Do the wallsit for ${base_target} seconds"
                }
            },
            "core": {
                "plank": {
                    "base_target": 10,
                    "quest_text": "Do the plank for ${base_target} seconds"
                },
                "situps": {
                    "base_target": 3,
                    "quest_text": "Do ${base_target} situps"
                },
                "backextentions": {
                    "base_target": 3,
                    "quest_text": "Do ${base_target} backextentions"
                },
                "burpees": {
                    "base_target": 3,
                    "quest_text": "Do ${base_target} burpees"
                },
                "crunches": {
                    "base_target": 3,
                    "quest_text": "Do ${base_target} crunches"
                }
            },
            "upperbody": {
                "pushups": {
                    "base_target": 3,
                    "quest_text": "Do ${base_target} pushups"
                },
                "dips": {
                    "base_target": 3,
                    "quest_text": "Do ${base_target} dips"
                },
                "armcircles": {
                    "base_target": 10,
                    "quest_text": "Do arm circles for ${base_target} seconds"
                }
            }
        }
    };

    const users_info_questTest = {
        "username": "as",
        "health": {
            "name": "sad",
            "age": "23",
            "height": "32",
            "weight": "2",
            "gender": "male"
        },
        "mastery": {
            "run": {
                "rank": 1,
                "elo": 0
            },
            "walk": {
                "rank": 1,
                "elo": 0
            },
            "cycling": {
                "rank": 1,
                "elo": 100
            },
            "squats": {
                "rank": 1,
                "elo": 0
            },
            "lunges": {
                "rank": 1,
                "elo": 0
            },
            "wallsit": {
                "rank": 1,
                "elo": 0
            },
            "plank": {
                "rank": 1,
                "elo": 0
            },
            "situps": {
                "rank": 1,
                "elo": 0
            },
            "backextentions": {
                "rank": 1,
                "elo": 0
            },
            "burpees": {
                "rank": 1,
                "elo": 0
            },
            "crunches": {
                "rank": 1,
                "elo": 0
            },
            "pushups": {
                "rank": 1,
                "elo": 0
            },
            "dips": {
                "rank": 1,
                "elo": 0
            },
            "armcircles": {
                "rank": 1,
                "elo": 0
            }
        },
        "hiddenRank": {
            "daily": 0,
            "weekly": 0,
            "monthly": 0
        },
        "tier": {
            "daily": {
                "rank": 1,
                "elo": 0
            },
            "weekly": {
                "rank": 7,
                "elo": 20
            },
            "monthly": {
                "rank": 1,
                "elo": 0
            }
        },
        "preset": {
            "name": "balance",
            "conf": {
                "cardio": 2,
                "lowerbody": 2,
                "core": 2,
                "upperbody": 2
            }
        },
        "friends": []
    };

    const users_questTest = {
        "password": "password"
    };
    fetchJSON('json/quest_templates.json').then(data => { assert(JSON.stringify(questTemplates) === JSON.stringify(data)), "Failed to fetched Quest_templates" });
    fetchJSON('json/quest_log.json').then(data => { assert(JSON.stringify(quest_log_QuestTest) === JSON.stringify(data["questTest"])), "Failed to fetched quest_log"});
    fetchJSON('json/users_info.json').then(data => { assert(JSON.stringify(users_info_questTest) === JSON.stringify(data["users_info"]["questTest"])), "Failed to fetched users_info" });
    fetchJSON('json/users.json').then(data => { assert(JSON.stringify(users_questTest) === JSON.stringify(data["obj_users"]["questTest"])), "Failed to fetched users" });
}

function test_check_currrent() {
    //We aspect daily quest still to be ongoing, therefor no state should be returned
    assert(check_current("daily", quest_log_QuestTest).state === undefined, "Failed check current daily");
    //We aspect weekly to be completed and therefor state to be "Done"
    assert(check_current("weekly", quest_log_QuestTest).state === "Done", "Failed check current weekly");
    //We aspect monthly to not have been made and therefor state to be "None"
    assert(check_current("monthly", quest_log_QuestTest).state === "None", "Failed check current monthly");
}

function test_modify_quest() {
    //modify_quest(quest, rank, difficulty, mastery, timespan);
    let quest = { "base_target": 5, "quest_text": "Cycle ${base_target} minutes" }

    //Base case
    let rank = 3;
    let difficulty = 0;
    let mastery = 2;
    let timespan = "daily";
    //Base case
    let target = 7 //floor(5 * ((rank + difficulty) * 0.5) * (mastery * 0.5))
    assert(modify_quest(quest, rank, difficulty, mastery, timespan)["base_target"] === target, "Modify 1");


    //By increasing rank to 10 the target should be 25
    quest = { "base_target": 5, "quest_text": "Cycle ${base_target} minutes" };
    rank = 10;
    target = 25;
    assert(modify_quest(quest, rank, difficulty, mastery, timespan)["base_target"] === target, "Modify 2");


    quest = { "base_target": 5, "quest_text": "Cycle ${base_target} minutes" };
    rank = 3;
    //if mastery increase to 10 target should 37
    mastery = 10;
    target = 37;
    assert(modify_quest(quest, rank, difficulty, mastery, timespan)["base_target"] === target, "Modify 3");


    mastery = 2
    quest = { "base_target": 5, "quest_text": "Cycle ${base_target} minutes" };
    //If we change time span to weekly an increase from base case should be 4 therfore 7.5*4 = 30
    timespan = "weekly";
    target = 30;
    assert(modify_quest(quest, rank, difficulty, mastery, timespan)["base_target"] === target, "Modify 4");

    //If timespan is monthly an increase in 13 instead 7,5 * 13 = 97
    quest = { "base_target": 5, "quest_text": "Cycle ${base_target} minutes" };
    timespan = "monthly";
    target = 97;
    assert(modify_quest(quest, rank, difficulty, mastery, timespan)["base_target"] === target, "Modify 5");

    quest = { "base_target": 5, "quest_text": "Cycle ${base_target} minutes" };
    timespan = "daily";
    //if we set diffculty -3 (easy quest)
    difficulty = -3;
    target = 5; //Since we cant go lower than base target
    assert(modify_quest(quest, rank, difficulty, mastery, timespan)["base_target"] === target, "Modify 6");

    quest = { "base_target": 5, "quest_text": "Cycle ${base_target} minutes" };
    timespan = "daily";
    //if we set diffculty 3 (hard quest)
    difficulty = 3;
    target = 15; //Since we cant go lower than base target
    assert(modify_quest(quest, rank, difficulty, mastery, timespan)["base_target"] === target, "Modify 7");
}

function change_amount_async(obj_para) {
    return new Promise((resolve, reject) => {
        change_amount(obj_para);
        resolve();
    });
}

/*async function test_change_amount_add() {    
    const obj_para = {
        questID: "quest1",
        timespan: "daily",
        date: "17/5/2024",
        user: "questTest",
        mode: "add",
        amount: 10
    };    
    
    const predata = await fetchJSON("json/quest_log.json");
    const startAmount = predata["questTest"][obj_para.timespan][obj_para.date].amount;
    const expectedAmount = startAmount + obj_para.amount;
    await change_amount_async(obj_para);
    // Fetch updated amount after adding
    const data = await fetchJSON("json/quest_log.json");
    actualAmount = data["questTest"][obj_para.timespan][obj_para.date].amount;
   
    
    
    
    assert(expectedAmount === actualAmount, "add value incorrect");    
}*/

/*async function test_change_amount_sub() {
    const obj_para = {
        questID: "quest1",
        timespan: "weekly",
        date: "16/5/2024",
        user: "questTest",
        mode: "sub",
        amount: 10
    };    
    
    const predata = await fetchJSON("json/quest_log.json");
    const startAmount = predata["questTest"][obj_para.timespan][obj_para.date].amount;
    
    const expectedAmount = startAmount - obj_para.amount;
    

    await change_amount_async(obj_para);
    
    const data = await fetchJSON("json/quest_log.json");
    actualAmount = data["questTest"][obj_para.timespan][obj_para.date].amount;
    
    
    assert(expectedAmount === actualAmount, "sub value incorrect");    

}*/

function test_award_elo(){
    award_elo(obj_para);
}

function test_get_type() {
    const obj_conf = {
        "a": 1,
        "b": 2,
        "c": 3
    };

    const results = {
        "a": 0,
        "b": 0,
        "c": 0
    };

    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
        const key = get_type(obj_conf);
        results[key]++;
    }

    const totalWeight = Object.values(obj_conf).reduce((acc, val) => acc + val, 0);

    for (let key in results) {
        const observed = results[key] / iterations;
        const expected = obj_conf[key] / totalWeight;
        const tolerance = 0.05; // Allowable deviation
        assert(Math.abs(observed - expected) < tolerance,
            `Key: ${key}, Observed: ${observed.toFixed(4)}, Expected: ${expected.toFixed(4)}`);
    }
}

function test_validate_input() {
    const originalAleret = window.alert;
    window.alert = function () { };
    let vaule = "231231"
    assert(validate_input(vaule), "should be True");
    vaule = "asda";
    assert(!validate_input(vaule), "should be false");
    vaule = "'";
    assert(!validate_input(vaule), "should be false");
    vaule = "2 2 2   3";
    assert(!validate_input(vaule), "should be false");
    vaule = "2.2";
    assert(!validate_input(vaule), "should be false");
    vaule = "-3";
    assert(!validate_input(vaule), "should be false");
    vaule = "";
    assert(!validate_input(vaule), "should be false");
    vaule = "0";
    assert(!validate_input(vaule), "should be false");
    window.alert = originalAleret;
}

function test_get_current_date_format() {
    dateFormat = get_current_date_format();
    dateArr = dateFormat.split("/");
    //Check if date is within 1 and 31
    assert(parseInt(dateArr[0]) <= 31 && parseInt(dateArr[0]) > 0, "Day number out of scope");
    assert(parseInt(dateArr[1]) <= 12 && parseInt(dateArr[1]) > 0, "Week number out of scope");
    assert(parseInt(dateArr[2]) <= 3000 && parseInt(dateArr[2]) > 0, "Month number out of scope");
}

function test_generate_random_number() {
    let max = 10
    let check = generate_random_number(max)
    for (let index = 0; index < 10; index++) {
        assert(check < max && check >= 0, "Number bigger than max");
    }
    max = 5
    check = generate_random_number(max)
    for (let index = 0; index < 10; index++) {
        assert(check < max && check >= 0, "Number bigger than max");
    }
    max = 20
    check = generate_random_number(max)
    for (let index = 0; index < 10; index++) {
        assert(check < max && check >= 0, "Number bigger than max");
    }

}

function test_is_empty_object() {

    const empty = new Object;
    assert(is_empty_object(empty), "Should be empty")
    const notEmpty = {
        duck: "maze"
    }
    assert(!is_empty_object(notEmpty), "Should not be Empty")
}