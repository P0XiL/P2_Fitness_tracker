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

let i =choose_quest_type(get_preset());
console.log(i)