/**
 * Makes rows of text, with the stats of a given user
 * @param {string} user - ID on the user you want stats on
 * @param {string} elementID - The ID on the element where the text goes 
 */
function individual_type(user, elementID) {
 return fetchJSON("json/quest_log.json")
    .then(data => {
      const processedTypes = {}; 

      for (let period in data[user]) {
        for (let key in data[user][period]) {
          const exercise = data[user][period][key].exercise;
          const amount = data[user][period][key].amount;
          if (amount !== undefined) {
            if (!processedTypes[exercise]) { 
              processedTypes[exercise] = { sum: 0 };
            }
            if (!isNaN(amount)) {
              processedTypes[exercise].sum += amount;
            }
          }
        }
      }
      const element = document.getElementById(elementID);
      element.innerHTML = "";
      for (let exercise in processedTypes) {
        const totalAmount = processedTypes[exercise].sum;
        element.innerHTML += `<pre id="${exercise}" sum="${totalAmount}">Amount of ${exercise} = ${totalAmount} \n\n</pre>`
      }
  return processedTypes;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
}

/**
 * Updates the graph
 * @param {string} exercise
 * @param {string} id
 */
function update_graph(exercise, id) {
    plot(exercise);
    change_text(exercise, id);
}

function update_graph_friend(exercise, id){
  plot_with_friends(exercise);
  change_text(exercise, id);
}
/**
 * Plots the graph for user
 * @param {string} exercise - exercise 
 */
function plot(exercise) {
  const ctx = document.getElementById("myChart");
  const user = localStorage.getItem("username");

  Promise.all([user_data_x(user, exercise), user_data_y(user, exercise)])
    .then(([labels, data]) => {
      let maxVal = data.length > 0 ? Math.max(...data) + 1 : 10;

      // Calculate the average of the data
      let average = recommended(exercise);
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

/**
 * Plot the graph with friends
 * @param {string} exercise - exercise of quest
 */
function plot_with_friends(exercise) {
  // Get the canvas element
  let user = localStorage.getItem("username");
  let friend = localStorage.getItem("friend");
  let ctx = document.getElementById("myChart2").getContext("2d");

  Promise.all([user_data_x(user, exercise), user_data_x(friend, exercise), user_data_y(user, exercise), user_data_y(friend, exercise)])
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
        label: friend,
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
 * @returns {array} An array, with data for y-axis
 */
function user_data_y(user, exercise) {
  return fetchJSON("json/quest_log.json")
    .then(data => {
      let amounts = [0];
      let totalAmounts = {}; 
      for (let period in data[user]) {
        for (let date in data[user][period]) {
          const entry = data[user][period][date];
          if (entry.exercise === exercise) {
            if (!totalAmounts[date]) {
              totalAmounts[date] = entry.amount;
            } else {
              totalAmounts[date] += entry.amount;
            }
          }
        }
      }
      for (let date in totalAmounts) {
        amounts.push(totalAmounts[date]);
      }
      return amounts;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
      return [];
    });
}

/**
 * Gets data for x-axis
 * @param {string} user - User ID
 * @param {string} exercise - Exercise type
 * @returns {array}  An array, with data for y-axis
 */
function user_data_x(user, exercise) {
  return fetchJSON("json/quest_log.json")
    .then(data => {
      let dates = ["1/1/2024"];
      for (let period in data[user]) {
        for (let date in data[user][period]) {
          if (data[user][period][date].exercise === exercise) {
              dates.push(date);
          }
        }
      }
      return dates;
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
      return [];
    });
}


function recommended(type){
  switch(type) {
    case 'run':
      return 15
    case 'walk':
      return 10
    case 'cycling':
      return 30
    case 'plank':
      return 1
    case 'situp':
      return 10
    case 'backextentions':
      return 10
    case 'burpees':
      return 15
    case 'crunches':
      return 15
    case 'squats':
      return 15
    case 'lunges':
      return 10
    case 'wallsit':
      return 15
    case 'pushup':
      return 15
    case 'dips':
      return 10
    case 'armcircles':
      return 10
    default:
      console.log("type not vailded");
  }
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
 * @param {string} elemetID - ID to element
 */
function change_text(type, elemetID) {
  // Get the element with the id "text"
  const element = document.getElementById(elemetID);
  // Change the text content
  element.innerHTML = "This Graph is based on type:  " + type;
}

function friendtext(elementID1, elementID2){
  friend = localStorage.getItem("friend");
  const element1 = document.getElementById(elementID1);
  const element2 = document.getElementById(elementID2);

  element1.innerHTML = " " + friend + " Stats";
  element2.innerHTML = "Comparing graph with " + friend;
}
