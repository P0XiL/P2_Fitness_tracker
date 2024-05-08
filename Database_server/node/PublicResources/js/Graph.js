try {
  const user = localStorage.getItem("username");
  if (typeof(user)!== "undefined") {
    // Close the dropdowns if the user clicks outside of it

  individual_type(user, "statsTextUser");
  individual_type("user", "statsTextFriend" );

  } else {
    console.error("Failed getting user")
  }

} catch (error) {
  console.error("Error in Graph script", error)
}

/**
 * Makes rows of text, with the stats of a given user
 * @param {string} user - ID on the user you want stats on
 * @param {string} elementID - The ID on the element where the text goes 
 */
function individual_type(user, elementID) {
  fetchJSON("json/quest_log.json")
    .then(data => {
      const processedTypes = {}; // Object to keep track of processed types
      let amount;

      for (let period in data[user]) {
        for (let key in data[user][period]) {
          const exercise = data[user][period][key].exercise;
          amount = data[user][period][key].amount;
          if (!processedTypes[exercise]) { // Check if type has already been processed
            processedTypes[exercise] = true;
            if (amount !== 0 && !isNaN(amount)) {
              const element = document.getElementById(elementID);
              try {
                element.innerHTML += `<pre id=${exercise} sum=${amount}>Amount of ${exercise} = ${amount} \n\n</pre>`;
              } catch (error) {
                console.error("Error setting innerHTML:", error);
              }
            }
          } else {
            if (amount !== 0 && !isNaN(amount)) {
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

let prePeriod = "daily";
let pretype = "run";
/**
 * Updates the graph
 * @param {string} type
 * @param {string} period - Quest timespan
 */
function update_graph(type, period) {
  const user = localStorage.getItem("username");
  if (type === null && period !== null) {
    plot(user, pretype, period);
    change_text(pretype, period, "text");
    prePeriod = period;
  }
  else if (type !== null && period === null) {
    plot(user, type, prePeriod);
    change_text(type, prePeriod, "text");
    pretype = type;
  } else {
    plot(user, pretype, prePeriod);
    change_text(pretype, preperiod, "text");
  }
}

/**
 * Plots the graph for user
 * @param {string} user - User ID 
 * @param {string} type
 * @param {string} period - Quest timespan 
 */
function plot(user, type, period) {
  const ctx = document.getElementById("myChart");

  Promise.all([user_data_x(user, type, period), user_data_y(user, type, period)])
    .then(([labels, data]) => {
      const maxVal = data.length > 0 ? Math.max(...data) + 1 : 10;
      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(255,164,0,255)",
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




// TODO when friends json is done
let prePeriodFriend = "daily";
let pretypeFriend = "run";
/**
 * Updates the friend graph
 * @param {string} user - ID for the user 
 * @param {string} friend - ID for friend 
 * @param {string} [type] - Type of exercise 
 * @param {string} [period] - Quest timespan 
 */
function update_graph_friend(user, friend, type, period) {
  if (type === null && period !== null) {
    plot_with_friends(user, friend, pretypeFriend, period);
    change_text(pretypeFriend, period, "textfriend");
    prePeriodFriend = period;
  }
  else if (type !== null && period === null) {
    plot_with_friends(user, friend, type, prePeriodFriend);
    change_text(type, prePeriodFriend, "textfriend");
    pretypeFriend = type;
  } else {
    plot_with_friends(user, friend, pretypeFriend, prePeriodFriend);
    change_text(type, period, "textfriend");
  }
}

/**
 * Plot the graph with friends
 * @param {string} user - User ID 
 * @param {string} friend - Friend ID
 * @param {string} type - Type of quest
 * @param {string} period - The timespan
 */
function plot_with_friends(user, friend, type, period) {
  //Get the canvas element
  const ctx = document.getElementById("myChart2").getContext("2d");

  Promise.all([user_data_x(user, type, period), user_data_x(friend, type, period), user_data_y(user, type, period), user_data_y(friend, type, period)])
    .then(([labels_user1, labels_user2, data_user1, data_user2]) => {
      //Sort the two x data
      const all_labels = [...new Set([...labels_user1, ...labels_user2])].sort();

      const dataset_user1 = {
        label: user,
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(255,255,255,1)",
        borderColor: "rgba(0,0,255,0.5)",
        data: [],
      };
      const dataset_user2 = {
        label: user2,
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(255,255,255,1)",
        borderColor: "rgba(245, 27, 19, 0.8)",
        data: [],
      };

      //Push data into datasets and if no data then set to 0
      all_labels.forEach(label => {
        dataset_user1.data.push(labels_user1.includes(label) ? data_user1[labels_user1.indexOf(label)] : 0);
        dataset_user2.data.push(labels_user2.includes(label) ? data_user2[labels_user2.indexOf(label)] : 0);
      });

      //Create the chart
      const myChart = new Chart(ctx, {
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




/**
 * Gets data for the y-axis
 * @param {string} user - User ID
 * @param {string} exercise - Exercise type
 * @param {string} period - Quest timespan
 * @returns {array} An array, with data for y-axis
 */
function user_data_y(user, exercise, period) {
  return fetchJSON("json/quest_log.json")
    .then(data => {
      const y = [];
      for (let date in data[user][period]) {
        if (data[user][period][date].exercise === exercise) {
          y.push(data[user][period][date].amount);
        }
      }
      return y;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
}

/**
 * Gets data for x-axis
 * @param {string} user - User ID
 * @param {string} exercise - Exercise type
 * @param {string} period - Quest timespan
 * @returns {array}  An array, with data for y-axis
 */
function user_data_x(user, exercise, period) {
  return fetchJSON("json/quest_log.json")
    .then(data => {
      const x = [];
      for (let key in data[user][period]) {
        if (data[user][period][key].exercise === exercise) {
          x.push(key);
        }
      }
      return x;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
}

/**
 * Opens the dropdown
 * @param {String} ID - Opens a dropdown for a given ID
 */
function dropdown_toggle(ID) {
  if (document.getElementById(ID).classList.toggle("show")){
    window.addEventListener("click", dropdown_window_click);
  } else {
    window.removeEventListener("click", dropdown_window_click);
  }
}

/**
 * Checks if a click is outside of of dropdown menus, and if closes dropdowns
 */
function dropdown_window_click() {
  if (!event.target.matches('.dropbtn')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    //Cycles though each dropdown and closes them
    for (let i = 0; i < dropdowns.length; i++) {
      //If the drop down is showing, remove show
      if (dropdowns[i].classList.contains('show')) {
        dropdowns[i].classList.remove('show');
      }
    }
    window.removeEventListener("click", dropdown_window_click);
  }
}


/**
 * Changes text for user graph
 * @param {string} type 
 * @param {string} period - Quest timespan
 * @param {string} elemetID - ID to element
 */
function change_text(type, period, elemetID) {
  // Get the element with the id "text"
  const element = document.getElementById(elemetID);
  // Change the text content
  element.innerHTML = "This Graph is based on type:  " + type + " in period: " + period;
}
