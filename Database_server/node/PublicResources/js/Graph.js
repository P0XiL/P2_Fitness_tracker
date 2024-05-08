const user = localStorage.getItem("username");


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropdown_close() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
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

function dropdown_close2() {
  document.getElementById("myDropdown2").classList.toggle("show");
}

function dropdown_close3() {
  document.getElementById("myDropdown3").classList.toggle("show");
}


function individual_type(user) {
  fetchJSON("json/quest_log.json")
    .then(data => {
      let text = ""; // Initialize text variable
      const processedTypes = {}; // Object to keep track of processed types
      let amount;

      for (let period in data[user]) {
        for (let key in data[user][period]) {
          const exercise = data[user][period][key].exercise;
          amount = data[user][period][key].amount;
          if (!processedTypes[exercise]) { // Check if type has already been processed
            processedTypes[exercise] = true;
              if (amount !== 0 && !isNaN(amount)) {
                const element = document.getElementById("statsText");
                try {
                  element.innerHTML += `<pre id=${exercise} sum=${amount}>Amount of ${exercise} = ${amount} \n\n</pre>`;
                } catch (error) {
                  console.error("Error setting innerHTML:", error);
                }
              }
          } else {
            if(amount !== 0 && !isNaN(amount)){
              const path = document.getElementById(exercise);
              const newsum = parseInt(path.getAttribute("sum")) + amount;
              path.setAttribute("sum", newsum);              
              path.textContent = `Amount of ${exercise} = ${newsum} \n\n`;
            }
          }
        }
      }
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
}

function individual_type_friend(user) {
  fetchJSON("json/quest_log.json")
    .then(data => {
      let text = ""; // Initialize text variable
      const processedTypes = {}; // Object to keep track of processed types
      const processedPeriod = {}
      let amount;

      for (let period in data[user]) {
        for (let key in data[user][period]) {
          const exercise = data[user][period][key].exercise;
          amount = data[user][period][key].amount;
          if (!processedTypes[exercise]) { // Check if type has already been processed
            processedTypes[exercise] = true;
              if (amount !== 0 && !isNaN(amount)) {
                const element1 = document.getElementById("statsText1");
                try {
                  element1.innerHTML += `<pre id=${exercise} sum=${amount}>Amount of ${exercise} = ${amount} \n\n</pre>`;
                } catch (error) {
                  console.error("Error setting innerHTML:", error);
                }
              }
          } else {
            if(amount !== 0 && !isNaN(amount)){
              const path = document.getElementById(exercise);
              const newsum = parseInt(path.getAttribute("sum")) + amount;
              path.setAttribute("sum", newsum);              
              path.textContent = `Amount of ${exercise} = ${newsum} \n\n`;
            }
          }
        }
      }
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
}


individual_type(user);
individual_type_friend("assholeblaster69");


let prePeriod = "daily";
let pretype = "cardio";

function update_graph(type, period) {
    let user = localStorage.getItem("username");
    plot(user, type);
    change_text(type);
}


function change_text(type) {
  // Get the element with the id "text"
  const element = document.getElementById("text");
  // Change the text content
  element.innerHTML = "This Graph is based on type:  " + type ;
}

function plot(user, type, period) {
  let ctx = document.getElementById("myChart");

  Promise.all([user_data_x(user, type), user_data_y(user, type)])
    .then(([labels, data]) => {
      let maxVal = data.length > 0 ? Math.max(...data) + 1 : 10;

      // Calculate the average of the data
      let average = 10;
      maxVal = Math.max(maxVal, average + 1);

      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            fill: false,
            label: user,
            lineTension: 0,
            backgroundColor: "rgba(255,164,0,255)",
            borderColor: "rgba(255,164,0,255)",
            data: data,
          },
          {
            type: 'line',
            label: 'Recommended',
            borderColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 2,
            data: Array(data.length).fill(average), // Array of average values
            fill: false,
            borderDash: [5, 5] // Add dashed border for distinction
          }]
        },
        options: {
          legend: { display: true },
          scales: {
            yAxes: [{ ticks: { min: 0, max: maxVal } }],
          }
        }
      });
    })
    .catch(error => {
      console.error("Error plotting graph:", error);
    });
}


function user_data_x(user, exercise) {
  return fetchJSON("json/quest_log.json")
    .then(data => {
      let dates = ["1/1/2024"];
      for (let period in data[user]) {
        for (let date in data[user][period]) {
          if (data[user][period][date].exercise === exercise && !dates.includes(date)) {
            // Check if any other exercise type exists for this date
            let otherTypes = Object.values(data[user][period][date])
              .filter(item => typeof item === 'object' && item.exercise !== exercise);
            if (otherTypes.length === 0) {
              dates.push(date);
            }
          }
        }
      }
      return dates;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
      return []; // Return an empty array in case of an error
    });
}

function user_data_y(user, exercise) {
  return fetchJSON("json/quest_log.json")
    .then(data => {
      let amounts = [0];
      for (let period in data[user]) {
        for (let date in data[user][period]) {
          if (data[user][period][date].exercise === exercise) {
            // Check if any other exercise type exists for this date
            let otherTypes = Object.values(data[user][period][date])
              .filter(item => typeof item === 'object' && item.exercise !== exercise);
            if (otherTypes.length === 0) {
              amounts.push(data[user][period][date].amount);
            }
          }
        }
      }
      return amounts;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
      return []; // Return an empty array in case of an error
    });
}

function plot_with_friends(user, user2, type, period) {
  // Get the canvas element
  let ctx = document.getElementById("myChart2").getContext("2d");

  Promise.all([user_data_x(user, type, period), user_data_x(user2, type, period), user_data_y(user, type, period), user_data_y(user2, type, period)])
    .then(([labels_user1, labels_user2, data_user1, data_user2]) => {
      //sort the two x data
      let all_labels = [...new Set([...labels_user1, ...labels_user2])].sort();

      let dataset_user1 = {
        label: user,
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(255,255,255,1)",
        borderColor: "rgba(0,0,255,0.5)",
        data: [],
      };
      let dataset_user2 = {
        label: user2,
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(255,255,255,1)",
        borderColor: "rgba(245, 27, 19, 0.8)",
        data: [],
      };

      //push data into datasets and if no data then set to 0
      all_labels.forEach(label => {
        dataset_user1.data.push(labels_user1.includes(label) ? data_user1[labels_user1.indexOf(label)] : 0);
        dataset_user2.data.push(labels_user2.includes(label) ? data_user2[labels_user2.indexOf(label)] : 0);
      });

      //creat the chart
      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: all_labels,
          datasets: [dataset_user1, dataset_user2]
        },
        options: {
          legend: { display: true },
          scales: {
            yAxes: [{
              ticks: { min: 0, max: Math.max(...dataset_user1.data.concat(dataset_user2.data)) + 1 }
            }]
          }
        }
      });
    })
    .catch(error => {
      console.error("Error plotting graph with friends:", error);
    });
}

// TODO when friends json is done
let prePeriodFriend = "daily";
let pretypeFriend = "cardio";

function update_graph_friend(user, user1, type, period) {
  if (type === null && period !== null) {
    plot_with_friends(user, user1, pretypeFriend, period);
    change_text_friend(pretypeFriend, period);
    prePeriodFriend = period;
  }
  else if (type !== null && period === null) {
    plot_with_friends(user, user1, type, prePeriodFriend);
    change_text_friend(type, prePeriodFriend);
    pretypeFriend = type;
  } else {
    plot_with_friends(user, user1, pretypeFriend, prePeriodFriend);
    change_text_friend(type, period);
  }
}

function change_text_friend(value, period) {
  // Get the element with the id "text"
  const element = document.getElementById("textfriend");
  // Change the text content
  element.innerHTML = "This Graph is based on type:  " + value + " in period: " + period;
}