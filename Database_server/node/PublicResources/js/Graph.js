

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

function individual_stats(user, type) {
  return fetchJSON("json/quest_log.json")
    .then(data => {
      let amount = 0;
      for (let period in data[user]) {
        for (let key in data[user][period]) {
          if (data[user][period][key].type === type) {
            amount += data[user][period][key].amount;
          }
        }
      }
      return amount;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
}

function individual_type() {
  fetchJSON("json/quest_log.json")
    .then(data => {
      let user = sessionStorage.getItem("username");
      let text = ""; // Initialize text variable
      let processedTypes = {}; // Object to keep track of processed types

      for (let period in data[user]) {
        for (let key in data[user][period]) {
          let type = data[user][period][key].type;
          if (!processedTypes[type]) { // Check if type has already been processed
            processedTypes[type] = true;
            individual_stats(user, type).then(amount => {
              text += "Amount of " + type + " = " + amount + " \n\n"; // Append stats to text
              const element = document.getElementById("statsText");
              const element1 = document.getElementById("statsText1");
              element.innerHTML = "<pre>" + text + "</pre>"; // Use textContent to set text with new lines
              element1.innerHTML = "<pre>" + text + "</pre>";
            });
          }
        }
      }
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
}

individual_type();


let prePeriod = "daily";
let pretype = "cardio";

function update_graph(type, period) {
  fetchJSON("json/quest_log.json")
    .then(data => {
      user = sessionStorage.getItem("username");
      console.log(user + "test");
  if (type === null && period !== null) {
    plot(user, pretype, period);
    change_text(pretype, period);
    prePeriod = period;
  }
  else if (type !== null && period === null) {
    plot(user, type, prePeriod);
    change_text(type, prePeriod);
    pretype = type;
  } else {
    plot(user, pretype, prePeriod);
    change_text(pretype, preperiod);
  }
})
.catch(error => {
  console.error("Error fetching JSON:", error);
});
}

function change_text(type, period) {
  // Get the element with the id "text"
  const element = document.getElementById("text");
  // Change the text content
  element.innerHTML = "This Graph is based on type:  " + type + " in period: " + period;
}

function plot(user, type, period) {
  let ctx = document.getElementById("myChart");

  Promise.all([user_data_x(user, type, period), user_data_y(user, type, period)])
    .then(([labels, data]) => {
      let maxVal = data.length > 0 ? Math.max(...data) + 1 : 10;
      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(255,255,255,1)",
            borderColor: "rgba(0,0,255,0.5)",
            data: data,
          }]
        },
        options: {
          legend: { display: false },
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


function user_data_x(user, type, period) {
  return fetchJSON("json/quest_log.json")
    .then(data => {
      let x = ["01/1/2024"];
      for (let key in data[user][period]) {
        if (data[user][period][key].type === type) {
          x.push(key);
        }
      }
      return x;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
      return []; // return an empty array in case of an error
    });
}

function user_data_y(user, type, period) {
  return fetchJSON("json/quest_log.json")
    .then(data => {
      let amountsWithType = [0];
      console.log(data[user][period]);
      for (let date in data[user][period]) {
        if (data[user][period][date].type === type) {
          console.log(data[user][period][date].type);
          amountsWithType.push(data[user][period][date].amount);
        }
      }
      console.log(amountsWithType + " test");
      return amountsWithType;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
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

function update_graph_friend(type, period) {
  if (type === null && period !== null) {
    plot_with_friends("Tobias", "Tobias1", pretypeFriend, period);
    change_text_friend(pretypeFriend, period);
    prePeriodFriend = period;
  }
  else if (type !== null && period === null) {
    plot_with_friends("Tobias", "Tobias1", type, prePeriodFriend);
    change_text_friend(type, prePeriodFriend);
    pretypeFriend = type;
  } else {
    plot_with_friends("Tobias", "Tobias1", pretypeFriend, prePeriodFriend);
    change_text_friend(type, period);
  }
}

function change_text_friend(value, period) {
  // Get the element with the id "text"
  const element = document.getElementById("textfriend");
  // Change the text content
  element.innerHTML = "This Graph is based on type:  " + value + " in period: " + period;
}
