scriptJS=require('./script');


 // Call the test functions
 TestfetchUserData();

// Tests if the correct user information is extracted from users_info.json
async function TestfetchUserData() {
    // For a new empty user
    try {
      // Call fetchUserData with exampleUsername
      const userData = await scriptJS.fetchUserData("exampleUsername");
  
      // Expected user data
      const expectedUserData = {
        username: "exampleUsername",
        health: {
          height: 0,
          weight: 0
        },
        mastery: {
          run: {
            rank: 1,
            elo: 0
          },
          walk: {
            rank: 1,
            elo: 0
          },
          cycling: {
            rank: 1,
            elo: 0
          },
          squats: {
            rank: 1,
            elo: 0
          },
          lunges: {
            rank: 1,
            elo: 0
          },
          wallsit: {
            rank: 1,
            elo: 0
          },
          plank: {
            rank: 1,
            elo: 0
          },
          situps: {
            rank: 1,
            elo: 0
          },
          backextentions: {
            rank: 1,
            elo: 0
          },
          burpees: {
            rank: 1,
            elo: 0
          },
          crunches: {
            rank: 1,
            elo: 0
          },
          pushups: {
            rank: 1,
            elo: 0
          },
          dips: {
            rank: 1,
            elo: 0
          },
          armcircles: {
            rank: 1,
            elo: 0
          }
        },
        hiddenRank: {
          daily: 0,
          weekly: 0,
          monthly: 0
        },
        tier: {
          daily: {
            rank: 1,
            elo: 0
          },
          weekly: {
            rank: 1,
            elo: 0
          },
          monthly: {
            rank: 1,
            elo: 0
          }
        },
        preset: {
          name: "balance",
          conf: {
            cardio: 2,
            lowerbody: 2,
            core: 2,
            upperbody: 2
          }
        }
      };
  
      // Check if userData matches expectedUserData
      if (JSON.stringify(userData) === JSON.stringify(expectedUserData)) {
        console.log("Test passed: Correct user information extracted from users_info.json");
      } else {
        console.error("Test failed: Incorrect user information extracted from users_info.json");
      }
    } catch (error) {
      console.error("Test failed: Error occurred while fetching user data:", error);
    }
}
  

