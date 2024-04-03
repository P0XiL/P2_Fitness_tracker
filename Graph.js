
let questlog = {
assholeblaster69:{
    daily:{
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


function Plot(user, type) {

let x = [];

for (let key in user.daily) {
    x.push([key, user.daily[key]]);
}

console.log(x);

let y = [];

for (let date in user.daily){
    y.push(user.daily[date].amount);
}

console.log(y);

let amountsWithType = [];


for (let date in user.daily) {
    if (user.daily[date].type === type) {
        amountsWithType.push(user.daily[date].amount);
    }
}
console.log(amountsWithType); 



    new Chart("myChart", {
      type: "line",
      data: {
        labels: x,
        datasets: [{
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: y
        }]
      },
      options: {
        legend: {display: false},
        scales: {
          yAxes: [{ticks: {min: 6, max:16}}],
        }
      }
    }); 
}




Plot(questlog.assholeblaster69, "run");




