
/*
const fs = require('fs');

fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    const jsonData = JSON.parse(data);
    return data;
});
*/


var myData = {
    date: new Date(),
    type: "pushup",
    amount: 15
}; // Needed to get stored to database.

Input(Date(), "handstand", 15, myData);


function Input(date, type, amount, myData) {
    console.log("test2");
    var now = "Mon Apr 01 2024 09:46:51 GMT+0200 (Central European Summer Time)";

    // Assuming myData is an object containing an array
    for (let key in myData) {
        console.log("Test3");
        if (Array.isArray(myData[key])) {
            console.log("test1");
            myData[key].forEach(obj => {
                if (obj.date.getDay() === now.getDay()) {
                    console.log("test");
                    if(obj.type === type){
                        obj.amount += amount;
                    }
                } else {
                    var newData = {
                        date: new Date(),
                        type: type,
                        amount: amount,
                    };
                    myData[key].push(newData); // Push newData to the array
                }
            });
        }
    }
    return myData; // Return the modified object
}


console.log(myData);

/*

//var exercise = document.getElementById("indsæt id for exercise ").getContext("indsæt context fra database")
var exercise = 20;
var myChart = new Chart(exercise, {
    type:  'line', 
    option: {
        scales: {
            xAxes: [{
                type: 'time',
            }]
        }
    },
    data: {
        labels: []
    }
})
function graph(exercise, data_time){
    
}
*/