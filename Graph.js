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


let questlog = {
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
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


/*
function userArrayMaker(obj){
  let userarray = [];
  for(let users in obj){
    userarray.push([users]);
  }
  console.log(userarray[0]);
}


function PlotWithFriends(type, userarray){
  let x = [];
  let i = 0;
  do{
    console.log("test2");
    for (let key in userarray) {
      console.log("test1");
      if(questlog.userarray[i].daily[key].type === type){
        x.push(key);
      }
    }
    i++;
  } while(i <= userarray.length);

  return x;
  }


console.log(PlotWithFriends("run", userArrayMaker(questlog)));
*/


function Plot(user, type) {

// input start dato
let x = [ "01/1/2024",];

for (let key in user.daily) {
  if(user.daily[key].type === type){
    x.push(key);
  }
}

//input 0 to start dato
let amountsWithType = [0,];


for (let date in user.daily) {
    if (user.daily[date].type === type) {
        amountsWithType.push(user.daily[date].amount);
    }
}

function MaxGraph(array){
  let max = 0;
  for (let number of array) {
    if (number > max) {
      max = number;
    }
  }
  return max;
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

Plot(questlog.assholeblaster69, "run");






