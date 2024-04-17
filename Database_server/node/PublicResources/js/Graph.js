

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

const obj_questLog = {
  assholeblaster69: {
    daily: {
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

    weekly: {
      "25/3/2024": {
        "type": "cycling",
        "target": 40,
        "amount": 40,
      },

      "22/3/2024": {
        "type": "walk",
        "target": 60,
        "amount": 35,
      }
    },

    monthly: {
      "1/2/2024": {
        "type": "crunches",
        "target": 300,
        "amount": 301,
      },

      "1/3/2024": {
        "type": "crunches",
        "target": 300,
        "amount": 2,
      },

    }

  },
  assholeblaster63: {
    daily: {
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

      "22/2/2024": {
        "type": "run",
        "target": 100,
        "amount": 50
      },

      "21/3/2024": {
        "type": "run",
        "target": 10,
        "amount": 10
      }
    },

    weekly: {
      "25/3/2024": {
        "type": "cycling",
        "target": 40,
        "amount": 40,
      },

      "22/3/2024": {
        "type": "walk",
        "target": 60,
        "amount": 35,
      }
    },

    monthly: {
      "1/2/2024": {
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

function individual_type() {
  fetchJSON("json/quest_log.json")
    .then(data => {
      userx = "assholeblaster69";
      user = data[userx];
      let text = ""; // Initialize text variable
      let processedTypes = {}; // Object to keep track of processed types

      for (let period in user) {
        for (let key in user[period]) {
          let type = user[period][key].type;
          if (!processedTypes[type]) { // Check if type has already been processed
            let amount = individual_stats(user, type, processedTypes); // Calculate stats for each type
            text += "Amount of " + type + " = " + amount + " \n\n"; // Append stats to text
            processedTypes[type] = true; // Mark type as processed
          }
        }
      }
      const element = document.getElementById("statsText");
      element.innerHTML = "<pre>" + text + "</pre>"; // Use textContent to set text with new lines
    })
}


//using json with friends
function friends_stats(user, friend) {
  for (let key in user_friend) {
    for (let key1 in user_friend[key]) {
      if (key1 === friend) {
        individual_stats(friend);
      }
      else {
        prompt("typed person is not your friend");
      }
    }
  }
}

individual_type();


let prePeriod = "daily";
let pretype = "run";

update_graph(pretype, prePeriod);

function update_graph(type, period) {
  if (type === null && period !== null) {
    plot("assholeblaster69", pretype, period);
    change_text(pretype, period);
    prePeriod = period;
  }
  else if (type !== null && period === null) {
    plot("assholeblaster69", type, prePeriod);
    change_text(type, prePeriod);
    pretype = type;
  } else {
    plot("assholeblaster69", pretype, prePeriod);
    change_text(type, period);
  }
}

function change_text(value, period) {
  // Get the element with the id "text"
  const element = document.getElementById("text");
  // Change the text content
  element.innerHTML = "This Graph is based on type:  " + value + " in period: " + period;
}

function plot(user, type, period) {
  // ploting with data.
  let ctx = document.getElementById("myChart");

  let myChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: user_data_x(user, type, period),
      datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(255,255,255,1)",
        borderColor: "rgba(0,0,255,0.5)",
        data: user_data_y(user, type, period),
      }]
    },
    options: {

      legend: { display: false, },
      scales: {
        yAxes: [{ ticks: { min: 0, max: Math.max(...user_data_y(user, type, period)) + 1 } }],
      }
    }
  });
}

function user_data_x(user, type, period) {
  let x = ["01/1/2024",];
  for (let key in obj_questLog[user][period]) {
    if (obj_questLog[user][period][key].type === type) {
      x.push(key);
    }
  }
  return x;
}

function user_data_y(user, type, period) {
  let amountsWithType = [0,];

  for (let date in obj_questLog[user][period]) {
    if (obj_questLog[user][period][date].type === type) {
      amountsWithType.push(obj_questLog[user][period][date].amount);
    }
  }
  return amountsWithType;
}

function plot_with_friends(user, user2, type, period) {
  // Get the canvas element
  let ctx = document.getElementById("myChart2").getContext("2d");


  let labels_user1 = user_data_x(user, type, period);
  let labels_user2 = user_data_x(user2, type, period);

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
    dataset_user1.data.push(labels_user1.includes(label) ? user_data_y(user, type, period)[labels_user1.indexOf(label)] : 0);
    dataset_user2.data.push(labels_user2.includes(label) ? user_data_y(user2, type, period)[labels_user2.indexOf(label)] : 0);
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
}


let prePeriodFriend = "daily";
let pretypeFriend = "run";

function update_graph_friend(type, period) {
  if (type === null && period !== null) {
    plot_with_friends("assholeblaster69", "assholeblaster63", pretypeFriend, period);
    change_text_friend(pretypeFriend, period);
    prePeriodFriend = period;
  }
  else if (type !== null && period === null) {
    plot_with_friends("assholeblaster69", "assholeblaster63", type, prePeriodFriend);
    change_text_friend(type, prePeriodFriend);
    pretypeFriend = type;
  } else {
    plot_with_friends("assholeblaster69", "assholeblaster63", pretypeFriend, prePeriodFriend);
    change_text_friend(type, period);
  }
}

function change_text_friend(value, period) {
  // Get the element with the id "text"
  const element = document.getElementById("textfriend");
  // Change the text content
  element.innerHTML = "This Graph is based on type:  " + value + " in period: " + period;
}

plot_with_friends("assholeblaster69", "assholeblaster63", "run", "daily");