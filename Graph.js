

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


function Plot(user) {

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


let x = [];

for (let key in questlog.assholeblaster69.daily) {
    x.push([key, questlog.assholeblaster69.daily[key]]);
}

let y = [];

for (let date in questlog.assholeblaster69.daily){
    y.push(questlog.assholeblaster69.daily[date].amount);
}

console.log(y);

let amountsWithRunType = [];


for (let date in questlog.assholeblaster69.daily) {
    if (questlog.assholeblaster69.daily[date].type === "run") {
        amountsWithRunType.push(questlog.assholeblaster69.daily[date].amount);
    }
}
console.log(amountsWithRunType); 
