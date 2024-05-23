runTests();
function runTests() {
  console.log("Running tests...");

  try {
      testSetupTiersForQuestPage();
      testFetchUserData();
      testGetTierRange();
      testGetSubTierRange();
      testCreateRankItem();
      testCapitalizeFirstLetter();
      testGetMaxElo();
      testSetupProfilePage();
      testDisplayProfile();
      testValidateIntegerInput();
      testUpdateBMI();
      testCalculateBMI();
      testDrawBMIGraph();
      testDisplayUserPreferences();
      testUpdatePreset();
      testUpdateUsersInfo();
      testUpdateCounter();

      console.log("All tests passed");
  } catch (error) {
      console.error("Error occurred during testing:", error.message);
  }
}


// Assertion function
function assert(condition, message) {
    if (!condition) {
      console.error("Assertion failed:", message);
    } 
}

async function testSetupTiersForQuestPage() {
    const expectedObject = {
        "username": "Lenny",
        "health": {
          "name": "Lenny",
          "age": "19",
          "height": 200,
          "weight": 100,
          "gender": "male",
          "fitnessGoal": "muscleGain",
          "activityLevel": "moderatelyActive"
        },
        "mastery": {
          "run": {
            "rank": 1,
            "elo": 0
          },
          "walk": {
            "rank": 1,
            "elo": 0
          },
          "cycling": {
            "rank": 1,
            "elo": 0
          },
          "squats": {
            "rank": 1,
            "elo": 0
          },
          "lunges": {
            "rank": 1,
            "elo": 0
          },
          "wallsit": {
            "rank": 1,
            "elo": 0
          },
          "plank": {
            "rank": 1,
            "elo": 0
          },
          "situps": {
            "rank": 1,
            "elo": 0
          },
          "backextentions": {
            "rank": 1,
            "elo": 0
          },
          "burpees": {
            "rank": 1,
            "elo": 0
          },
          "crunches": {
            "rank": 1,
            "elo": 0
          },
          "pushups": {
            "rank": 1,
            "elo": 0
          },
          "dips": {
            "rank": 1,
            "elo": 0
          },
          "armcircles": {
            "rank": 1,
            "elo": 0
          }
        },
        "hiddenRank": {
          "daily": 0,
          "weekly": 0,
          "monthly": 0
        },
        "tier": {
          "daily": {
            "rank": 1,
            "elo": 0
          },
          "weekly": {
            "rank": 1,
            "elo": 0
          },
          "monthly": {
            "rank": 1,
            "elo": 0
          }
        },
        "preset": {
          "name": "balance",
          "conf": {
            "cardio": 2,
            "lowerbody": 2,
            "core": 2,
            "upperbody": 2
          }
        }
      };

    // Assuming Lenny is defined somewhere
    let result = await setupTiersForQuestPage("Lenny");

    assert(JSON.stringify(result) === JSON.stringify(expectedObject), "Returned object from testSetupTiersForQuestPage does not match expected object");
}

async function testFetchUserData(){
    const expectedObject = {
        "username": "Lenny",
        "health": {
          "name": "Lenny",
          "age": "19",
          "height": 200,
          "weight": 100,
          "gender": "male",
          "fitnessGoal": "muscleGain",
          "activityLevel": "moderatelyActive"
        },
        "mastery": {
          "run": {
            "rank": 1,
            "elo": 0
          },
          "walk": {
            "rank": 1,
            "elo": 0
          },
          "cycling": {
            "rank": 1,
            "elo": 0
          },
          "squats": {
            "rank": 1,
            "elo": 0
          },
          "lunges": {
            "rank": 1,
            "elo": 0
          },
          "wallsit": {
            "rank": 1,
            "elo": 0
          },
          "plank": {
            "rank": 1,
            "elo": 0
          },
          "situps": {
            "rank": 1,
            "elo": 0
          },
          "backextentions": {
            "rank": 1,
            "elo": 0
          },
          "burpees": {
            "rank": 1,
            "elo": 0
          },
          "crunches": {
            "rank": 1,
            "elo": 0
          },
          "pushups": {
            "rank": 1,
            "elo": 0
          },
          "dips": {
            "rank": 1,
            "elo": 0
          },
          "armcircles": {
            "rank": 1,
            "elo": 0
          }
        },
        "hiddenRank": {
          "daily": 0,
          "weekly": 0,
          "monthly": 0
        },
        "tier": {
          "daily": {
            "rank": 1,
            "elo": 0
          },
          "weekly": {
            "rank": 1,
            "elo": 0
          },
          "monthly": {
            "rank": 1,
            "elo": 0
          }
        },
        "preset": {
          "name": "balance",
          "conf": {
            "cardio": 2,
            "lowerbody": 2,
            "core": 2,
            "upperbody": 2
          }
        }
      };

    // Assuming Lenny is defined somewhere
    let result = await fetchUserData("Lenny");

    assert(JSON.stringify(result) === JSON.stringify(expectedObject), "Returned object from fetchUserData does not match expected object");
}

function testGetTierRange() {
    // Test cases for ranks within each tier range
    assert(getTierRange(1) === '1-15', "Rank 1 should return '1-15'");
    assert(getTierRange(15) === '1-15', "Rank 15 should return '1-15'");
    assert(getTierRange(16) === '16-30', "Rank 16 should return '16-30'");
    assert(getTierRange(30) === '16-30', "Rank 30 should return '16-30'");
    assert(getTierRange(31) === '31-45', "Rank 31 should return '31-45'");
    assert(getTierRange(45) === '31-45', "Rank 45 should return '31-45'");

    // Test case for rank outside the defined ranges
    assert(getTierRange(50) === 'Unknown', "Rank 50 should return 'Unknown'");
}

function testGetSubTierRange() {
    // Test cases for ranks within each sub-tier range
    assert(getSubTierRange(1) === '1-3', "Rank 1 should return '1-3'");
    assert(getSubTierRange(3) === '1-3', "Rank 3 should return '1-3'");
    assert(getSubTierRange(4) === '4-6', "Rank 4 should return '4-6'");
    assert(getSubTierRange(6) === '4-6', "Rank 6 should return '4-6'");
    assert(getSubTierRange(7) === '7-9', "Rank 7 should return '7-9'");
    assert(getSubTierRange(9) === '7-9', "Rank 9 should return '7-9'");
    assert(getSubTierRange(10) === '10-12', "Rank 10 should return '10-12'");
    assert(getSubTierRange(12) === '10-12', "Rank 12 should return '10-12'");
    assert(getSubTierRange(13) === '13-15', "Rank 13 should return '13-15'");
    assert(getSubTierRange(15) === '13-15', "Rank 15 should return '13-15'");
    assert(getSubTierRange(16) === '16-18', "Rank 16 should return '16-18'");
    assert(getSubTierRange(18) === '16-18', "Rank 18 should return '16-18'");
    assert(getSubTierRange(19) === '19-21', "Rank 19 should return '19-21'");
    assert(getSubTierRange(21) === '19-21', "Rank 21 should return '19-21'");
    assert(getSubTierRange(22) === '22-24', "Rank 22 should return '22-24'");
    assert(getSubTierRange(24) === '22-24', "Rank 24 should return '22-24'");
    assert(getSubTierRange(25) === '25-27', "Rank 25 should return '25-27'");
    assert(getSubTierRange(27) === '25-27', "Rank 27 should return '25-27'");
    assert(getSubTierRange(28) === '28-30', "Rank 28 should return '28-30'");
    assert(getSubTierRange(30) === '28-30', "Rank 30 should return '28-30'");
    assert(getSubTierRange(31) === '31-33', "Rank 31 should return '31-33'");
    assert(getSubTierRange(33) === '31-33', "Rank 33 should return '31-33'");
    assert(getSubTierRange(34) === '34-36', "Rank 34 should return '34-36'");
    assert(getSubTierRange(36) === '34-36', "Rank 36 should return '34-36'");
    assert(getSubTierRange(37) === '37-39', "Rank 37 should return '37-39'");
    assert(getSubTierRange(39) === '37-39', "Rank 39 should return '37-39'");
    assert(getSubTierRange(40) === '40-42', "Rank 40 should return '40-42'");
    assert(getSubTierRange(42) === '40-42', "Rank 42 should return '40-42'");
    assert(getSubTierRange(43) === '43-45', "Rank 43 should return '43-45'");
    assert(getSubTierRange(45) === '43-45', "Rank 45 should return '43-45'");

    // Test case for rank outside the defined ranges
    assert(getSubTierRange(50) === 'Unknown', "Rank 50 should return 'Unknown'");
}

function testCreateRankItem() {
    // Create a container element for testing
    const container = document.createElement('div');

    // Call the createRankItem function
    createRankItem(container, 'Running', 'image/bronzeTier.png', 300, 'weekly', true);

    // Check if the container has one child element (the item created by createRankItem)
    assert(container.children.length === 1, "Container should have one child element");

    // Check if the child element has the correct structure and content
    const itemDiv = container.children[0];
    assert(itemDiv.tagName === 'DIV', "Child element should be a div");
    assert(itemDiv.classList.contains('mastery-grid-item'), "Child element should have class 'mastery-grid-item'");

    // Check if the title element is correct
    const itemTitle = itemDiv.querySelector('h3');
    assert(itemTitle.textContent === 'Running: ', "Title text content should be 'Running: '");

    // Check if the image element is correct
    const itemImage = itemDiv.querySelector('img');
    assert(itemImage.src.includes('image/bronzeTier.png'), "Image source should include 'image/bronzeTier.png'");
    assert(itemImage.alt === 'Running Tier Image', "Image alt attribute should be 'Running Tier Image'");

    // Check if the progress bar is correct
    const progressBar = itemDiv.querySelector('.progress-bar');
    assert(progressBar !== null, "Progress bar should exist");

    const eloProgress = progressBar.querySelector('.elo-progress');
    assert(eloProgress !== null, "Elo progress should exist");

    // Check if the width of the elo progress bar is calculated correctly
    const expectedPercentage = (300 / 500) * 100; // 300 elo out of 500 max elo
    assert(eloProgress.style.width === `${expectedPercentage}%`, "Elo progress width should be calculated correctly");
}

function testCapitalizeFirstLetter() {
    // Test cases for different input strings
    assert(capitalizeFirstLetter('hello') === 'Hello', "Capitalize 'hello' should result in 'Hello'");
    assert(capitalizeFirstLetter('world') === 'World', "Capitalize 'world' should result in 'World'");
    assert(capitalizeFirstLetter('javascript') === 'Javascript', "Capitalize 'javascript' should result in 'Javascript'");
    assert(capitalizeFirstLetter('') === '', "Capitalize empty string should result in empty string");
}

function testGetMaxElo() {
    // Test cases for different periods
    assert(getMaxElo('Daily') === 100, "Max Elo for 'Daily' should be 100");
    assert(getMaxElo('Weekly') === 40, "Max Elo for 'Weekly' should be 40");
    assert(getMaxElo('Monthly') === 20, "Max Elo for 'Monthly' should be 20");

    // Test case for unknown period
    assert(getMaxElo('Yearly') === 100, "Max Elo for unknown period should default to 100");
}

async function testSetupProfilePage(){
    const expectedObject = {
        "username": "Lenny",
        "health": {
          "name": "Lenny",
          "age": "19",
          "height": 200,
          "weight": 100,
          "gender": "male",
          "fitnessGoal": "muscleGain",
          "activityLevel": "moderatelyActive"
        },
        "mastery": {
          "run": {
            "rank": 1,
            "elo": 0
          },
          "walk": {
            "rank": 1,
            "elo": 0
          },
          "cycling": {
            "rank": 1,
            "elo": 0
          },
          "squats": {
            "rank": 1,
            "elo": 0
          },
          "lunges": {
            "rank": 1,
            "elo": 0
          },
          "wallsit": {
            "rank": 1,
            "elo": 0
          },
          "plank": {
            "rank": 1,
            "elo": 0
          },
          "situps": {
            "rank": 1,
            "elo": 0
          },
          "backextentions": {
            "rank": 1,
            "elo": 0
          },
          "burpees": {
            "rank": 1,
            "elo": 0
          },
          "crunches": {
            "rank": 1,
            "elo": 0
          },
          "pushups": {
            "rank": 1,
            "elo": 0
          },
          "dips": {
            "rank": 1,
            "elo": 0
          },
          "armcircles": {
            "rank": 1,
            "elo": 0
          }
        },
        "hiddenRank": {
          "daily": 0,
          "weekly": 0,
          "monthly": 0
        },
        "tier": {
          "daily": {
            "rank": 1,
            "elo": 0
          },
          "weekly": {
            "rank": 1,
            "elo": 0
          },
          "monthly": {
            "rank": 1,
            "elo": 0
          }
        },
        "preset": {
          "name": "balance",
          "conf": {
            "cardio": 2,
            "lowerbody": 2,
            "core": 2,
            "upperbody": 2
          }
        }
      };

    // Assuming Lenny is defined somewhere
    let result = await setupProfilePage("Lenny");

    assert(JSON.stringify(result) === JSON.stringify(expectedObject), "Returned object from setupProfilePage does not match expected object");
}

// Define the testDisplayProfile function
function testDisplayProfile() {
    // Mock console.error to capture its output
    let consoleError = null;
    console.error = message => {
        consoleError = message;
    };
    
    // Test case: When data is null
    consoleError = null; // Reset consoleError
    displayProfile(null, 'testUser');
    if (consoleError !== 'User data is null or undefined') {
        console.log("Test failed: displayProfile did not log error message when data is null");
    } else {
    }
    
    // Test case: When data is undefined
    consoleError = null; // Reset consoleError
    displayProfile(undefined, 'testUser');
    if (consoleError !== 'User data is null or undefined') {
        console.log("Test failed: displayProfile did not log error message when data is undefined");
    } else {
    }
    
}

function testValidateIntegerInput() {
    // Test valid integer input
    let result = validateIntegerInput(42);
    assert(result === true, "Valid integer input should return true");

    // Test valid non-integer input
    result = validateIntegerInput(42.5);
    assert(result === false, "Non-integer input should return false");

    // Test invalid input (NaN)
    result = validateIntegerInput(NaN);
    assert(result === false, "NaN input should return false");

    // Test invalid input (negative integer)
    result = validateIntegerInput(-42);
    assert(result === false, "Negative integer input should return false");

    // Test invalid input (negative non-integer)
    result = validateIntegerInput(-42.5);
    assert(result === false, "Negative non-integer input should return false");
}

// Define a function to test updateBMI
function testUpdateBMI() {
    // Call updateBMI with different BMI values
    updateBMI(180, 80);
    // Check if BMI text content is correctly set
    if (bmiText.textContent !== 'BMI: 24.7') {
        console.error("Test failed: BMI text content is incorrect");
    } else {
    }

    // Call updateBMI with a BMI greater than 30
    updateBMI(180, 100);
    // Check if BMI warning message is correctly appended
    if (!bmiText.innerHTML.includes('BMI is over 30')) {
        console.error("Test failed: BMI warning message not found for BMI > 30");
    } else {
    }

    // Call updateBMI with a BMI between 25 and 30
    updateBMI(180, 85);
    // Check if BMI warning message is correctly appended
    if (!bmiText.innerHTML.includes('BMI is over 25')) {
        console.error("Test failed: BMI warning message not found for BMI > 25");
    } else {
    }

    // Call updateBMI with a BMI between 20 and 25
    updateBMI(180, 75);
    // Check if BMI message for healthy weight is correctly appended
    if (!bmiText.innerHTML.includes('Great job!')) {
        console.error("Test failed: BMI message for healthy weight not found");
    } else {
    }

    // Call updateBMI with a BMI less than 18.5
    updateBMI(180, 60);
    // Check if BMI warning message for underweight is correctly appended
    if (!bmiText.innerHTML.includes('BMI is under 18.5')) {
        console.error("Test failed: BMI warning message for underweight not found");
    } else {
    }
}

function testCalculateBMI() {
    // Test valid inputs
    let result = calculateBMI(180, 75); // Height: 180 cm, Weight: 75 kg
    assert(result === '23.1', "BMI should be approximately 23.1");

    // Test invalid height (zero height)
    result = calculateBMI(0, 75); // Height: 0 cm, Weight: 75 kg
    assert(result === Infinity, "BMI should be Infinity for zero height");

    // Test invalid weight (zero weight)
    result = calculateBMI(180, 0); // Height: 180 cm, Weight: 0 kg
    assert(Number.isNaN(result), "BMI should be NaN for zero weight");

    // Test invalid inputs (negative height and weight)
    result = calculateBMI(-180, -75); // Height: -180 cm, Weight: -75 kg
    assert(Number.isNaN(result), "BMI should be NaN for negative height and weight");

    // Test invalid inputs (non-numeric height and weight)
    result = calculateBMI('abc', 'xyz'); // Height: 'abc', Weight: 'xyz'
    assert(Number.isNaN(result), "BMI should be NaN for non-numeric height and weight");

}

// Define a function to test drawBMIGraph
function testDrawBMIGraph() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'bmiGraph';
    canvas.width = 400; // Set canvas width
    canvas.height = 200; // Set canvas height

    // Append the canvas to the document body
    document.body.appendChild(canvas);

    // Call drawBMIGraph with a BMI value
    drawBMIGraph(20); // Assuming a BMI value within the "Normal" category

    // Get the canvas context
    const ctx = canvas.getContext('2d');

    // Check if the red dot is correctly positioned within the "Normal" category
    const dotX = 10 + (20 - 18.5) * 95 / (24.9 - 18.5); // Calculate expected x position of the dot
    const dotY = canvas.height / 2; // Assuming the dot's y position remains constant
    const dotColor = ctx.getImageData(dotX, dotY, 1, 1).data; // Get the color of the pixel at the dot's position

    if (dotColor[0] !== 255 || dotColor[1] !== 0 || dotColor[2] !== 0) {
        console.error("Test failed: Red dot is not correctly positioned within the 'Normal' category");
    } else {
    }

    // Remove the canvas from the document body
    document.body.removeChild(canvas);
}

async function testDisplayUserPreferences() {
  // Define the setup function
  async function setup() {
      // Simulate fetching user info
      const userInfo = {
          preset: {
              name: 'custom',
              conf: {
                  cardio: 5,
                  lowerbody: 7,
                  core: 3,
                  upperbody: 8
              }
          }
      };

      // Call displayUserPreferences to generate HTML elements
      await displayUserPreferences('testUser', userInfo);
  }

  // Define the tests
  function runTests() {
      // Access the HTML elements after they are generated
      const sliders = document.querySelectorAll('input[type="range"]');
      const select = document.getElementById('presetDropdown');
      const buttons = document.querySelectorAll('button');

      // Perform assertions
      assert(sliders.length > 0, "Sliders should exist");
      assert(select !== null, "Select element should exist");
      assert(buttons.length > 0, "Buttons should exist");

      // Additional assertions for sliders
      sliders.forEach(slider => {
          assert(slider.getAttribute('type') === 'range', "Slider should have type 'range'");
          assert(slider.getAttribute('min') === '0', "Slider should have min value of '0'");
          assert(slider.getAttribute('max') === '10', "Slider should have max value of '10'");
          assert(slider.getAttribute('disabled') === (select.value !== 'custom' ? 'disabled' : null), "Slider should be disabled based on preset value");
      });

      // Additional assertions for select element
      assert(select.getElementsByTagName('option').length === 4, "Select element should have 4 options");

      // Additional assertions for buttons
      buttons.forEach(button => {
          assert(button.tagName.toLowerCase() === 'button', "Element should be a button");
          assert(button.textContent.toLowerCase().includes('save preset') === (select.value === 'custom'), "Button text should be 'Save Preset' based on preset value");
      });

      // Output results
  }

  // Call the setup function to start the tests
  await setup();

  // Run the tests after the setup is complete
  runTests();
}

async function testUpdatePreset() {
  // Test case: 'lose weight' preset
  const userDataLoseWeight = await updatePreset('Lenny2', 'lose weight');
  if (userDataLoseWeight) {
      assert(userDataLoseWeight.preset && userDataLoseWeight.preset.name === 'lose weight', "Preset name should be 'lose weight'");
      assert(userDataLoseWeight.preset.conf.cardio === 7, "Cardio should be set to 7");
      assert(userDataLoseWeight.preset.conf.lowerbody === 1, "Lower body should be set to 1");
      assert(userDataLoseWeight.preset.conf.core === 1, "Core should be set to 1");
      assert(userDataLoseWeight.preset.conf.upperbody === 1, "Upper body should be set to 1");
  }
  else {
    console.error("No userDataLoseWeight")
  }

  // Test case: 'strength' preset
  const userDataStrength = await updatePreset('Lenny2', 'strength');
  if (userDataStrength) {
      assert(userDataStrength.preset.name === 'strength', "Preset name should be 'strength'");
      assert(userDataStrength.preset.conf.cardio === 1, "Cardio should be set to 1");
      assert(userDataStrength.preset.conf.lowerbody === 3, "Lower body should be set to 3");
      assert(userDataStrength.preset.conf.core === 3, "Core should be set to 3");
      assert(userDataStrength.preset.conf.upperbody === 3, "Upper body should be set to 3");
  }
  else {
    console.error("No userDataStrength")
  }

  // Test case: 'balance' preset
  const userDataBalance = await updatePreset('Lenny2', 'balance');
  if (userDataBalance) {
      assert(userDataBalance.preset.name === 'balance', "Preset name should be 'balance'");
      assert(userDataBalance.preset.conf.cardio === 2, "Cardio should be set to 2");
      assert(userDataBalance.preset.conf.lowerbody === 2, "Lower body should be set to 2");
      assert(userDataBalance.preset.conf.core === 2, "Core should be set to 2");
      assert(userDataBalance.preset.conf.upperbody === 2, "Upper body should be set to 2");
  }
  else {
    console.error("No userDataBalance")
  }

  // Test case: 'custom' preset
  const userDataCustom = await updatePreset('Lenny2', 'custom');
  if (userDataCustom) {
      assert(userDataCustom.preset.name === 'custom', "Preset name should be 'custom'");
      assert(userDataCustom.preset.conf.cardio === 2, "Cardio should be set to 2");
      assert(userDataCustom.preset.conf.lowerbody === 2, "Lower body should be set to 2");
      assert(userDataCustom.preset.conf.core === 2, "Core should be set to 2");
      assert(userDataCustom.preset.conf.upperbody === 2, "Upper body should be set to 2");
  }
  else {
    console.error("No userDataCustom")
  }
}


async function testUpdateUsersInfo() {
  let newUserInfo = await fetchUserData("Lenny3");

  try {
    await update_users_info(newUserInfo)
  }
  catch(error){
    console.error('testUpdateUsersInfo failed');
  }

  // Test case: Failure to update user information
  newUserInfo = null; // Simulate no user info
  try {
      await update_users_info(newUserInfo);
      console.error('Test failed: User info updated successfully even though it should have failed due to null user info');
  } catch (error) {
  }
  
}

async function testUpdateCounter() {
  // Create a dummy element to use as a container for testing
  const container = document.createElement('div');
  container.innerHTML = `
      <div id="testCounter1Counter"></div>
      <div id="testCounter2Counter"></div>
  `;

  // Append the container to the document body
  document.body.appendChild(container);

  // Call the updateCounter function with test values
  updateCounter('testCounter1', 10);
  updateCounter('testCounter2', 20);

  // Check if the counters have been updated correctly
  const counter1 = document.getElementById('testCounter1Counter').textContent;
  const counter2 = document.getElementById('testCounter2Counter').textContent;

  if (counter1 === '10' && counter2 === '20') {
  } else {
      console.error('Test failed: Counters not updated correctly.');
  }

  // Remove the container from the document body after testing
  document.body.removeChild(container);
}