//make a function thats reads from json file 
/*
let fs = require('fs');

fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    // Parse JSON data
    const jsonData = JSON.parse(data);
    // Do something with the data
    console.log(jsonData);
});
*/


const obj_questLog = {
  assholeblaster69:{
      daily:{
       "31/3/2024": {
          "type": "pushups",
          "target": 100,
          "amount": 5
        },
  
        "31/2/2024": {
          "type": "run",
          "target": 100,
          "amount": 5
        },
  
        "30/2/2024": {
          "type": "pushups",
          "target": 100,
          "amount": 5
        },
  
        "26/3/2024": {
          "type": "run",
          "target": 10,
          "amount": 12
        }
      },
  
      weekly:{
         "25/3/2024":{
            "type": "cycling",
            "target": 40,
            "amount": 40,
        },
  
         "22/3/2024":{
            "type": "walk",
            "target": 60,
            "amount": 35,
        }
      },
  
      monthly:{
        "1/2/2024":{
            "type": "crunches",
            "target": 300,
            "amount": 301,
        },
  
        "1/3/2024":{
          "type": "crunches",
          "target": 300,
          "amount": 2,
      },
  
      }
  
  },
  assholeblaster63:{
    daily:{
     "31/3/2024": {
        "type": "pushups",
        "target": 100,
        "amount": 5
      },
  
      "24/2/2024": {
        "type": "run",
        "target": 100,
        "amount": 5
      },
  
      "30/2/2024": {
        "type": "pushups",
        "target": 100,
        "amount": 5
      },
  
      "21/3/2024": {
        "type": "run",
        "target": 10,
        "amount": 10
      }
    },
  
    weekly:{
       "25/3/2024":{
          "type": "cycling",
          "target": 40,
          "amount": 40,
      },
  
       "22/3/2024":{
          "type": "walk",
          "target": 60,
          "amount": 35,
      }
    },
  
    monthly:{
      "1/2/2024":{
          "type": "crunches",
          "target": 300,
          "amount": 301,
      },
  
    }
  
  }
  
  }
  
  /* When the user clicks on the button, 
  toggle between hiding and showing the dropdown content */
  function dropdown_close() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  } 

  function dropdown_close1() {
    document.getElementById("myDropdown1").classList.toggle("show");
  }
  
  
  
  function user_array_maker(obj){
    let userarray = [];
    for(let users in obj){
      userarray.push([users]);
    }
    return userarray;
  }
  
  
  function plot_with_friends(type, userarray){
    for(let users in userarray){
      
    }
  }
  
  function individual_stats(user, type, processedTypes) {
    let amount = 0;
    for (let period in user) {
      for (let key in user[period]) {
        if (user[period][key].type === type) {
          amount += user[period][key].amount;
          processedTypes[type] = true; // Mark type as processed
        }
      }
    }
    return amount;
  }
  
  function individual_type(user) {
    let text = ""; // Initialize text variable
    let processedTypes = {}; // Object to keep track of processed types
  
    for (let period in user) {
      for (let key in user[period]) {
        let type = user[period][key].type;
        if (!processedTypes[type]) { // Check if type has already been processed
          let amount = individual_stats(user, type, processedTypes); // Calculate stats for each type
          text += "Amount of " + type + " = " + amount + " \n\n"; // Append stats to text
          console.log(text);
          processedTypes[type] = true; // Mark type as processed
        }
      }
    }
    const element = document.getElementById("statsText");
    element.innerHTML = "<pre>" + text + "</pre>" ; // Use textContent to set text with new lines
  }


  //using json with friends
  function friends_stats(user, friend){
    for(let key in user_friend){
      for(let key1 in user_friend[key]){
        if(key1 === friend){
          individual_stats(friend);
        }
        else{
          prompt("typed person is not your friend");
        }
      }
    }
  }
  
  individual_type(obj_questLog.assholeblaster69);
  

  // Make so function returns users id for questlog json.
  function user(){
    return username;
  }
  
  
  let prePeriod = "daily"; // declare prePeriod outside the function
  let preValue = "run";

  update_graph(preValue, prePeriod);

  function update_graph(value, period){
      if(value === null && period !== null){
          plot("assholeblaster69", preValue, period);
          change_text(preValue, period);
          prePeriod = period; // Update prePeriod after each call
      }
      else if(value !== null && period === null){
          plot("assholeblaster69", value, prePeriod); // Use prePeriod here
          change_text(value, prePeriod); // Use prePeriod here
          preValue = value; // Assign value to preValue
      } else {
          plot("assholeblaster69", preValue, prePeriod); // Use preValue and prePeriod here
          change_text(value, period);
      }
  }
  
  function change_text(value, period) {
    // Get the element with the id "text"
    const element = document.getElementById("text");
    // Change the text content
    element.innerHTML = "This Graph is based on type:  " + value + " in period: " + period;
  }
  
  function plot(user, type, period) {
    console.log(period);
  // input start dato
  let x = [ "01/1/2024",];
  
  for (let key in obj_questLog[user][period]) {
    if(obj_questLog[user][period][key].type === type){
      x.push(key);
    }
  }
    
  //input 0 to start dato
  let amountsWithType = [0,];
    
  for (let date in obj_questLog[user][period]) {
      if (obj_questLog[user][period][date].type === type) {
          amountsWithType.push(obj_questLog[user][period][date].amount);
      }
  }
  // ploting with data.
  let ctx = document.getElementById("myChart");
  
      let myChart =new Chart(ctx, {
        type: "line",
  
        data: {
          labels: x,
          datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(255,255,255,1)",
            borderColor: "rgba(0,0,255,0.5)",
            data: amountsWithType
          }]
        },
        options: {
          
          legend: {display: false,},
          scales: {
            yAxes: [{ticks: {min: 0, max: Math.max(...amountsWithType) + 1}}],
          }
        }
      }); 
  }