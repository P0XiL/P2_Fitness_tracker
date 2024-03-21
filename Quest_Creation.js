function get_preset(){
    //Gets input from storage
    let preset = ["run", "run", "run", "walk", "walk", "stomach", "back"];
    return preset;
}
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
            modifer_scale: 0.5, //A number to scale modifer
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
    return quests["quest" + generate_random_number(Object.keys(quests).length+1)]
}

let quest = choose_quest(get_quest_object(choose_quest_type(get_preset())));
console.log(quest);