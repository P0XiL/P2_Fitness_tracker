runtestGraph();
function runtestGraph() {
    try {
        console.log("Running graph tests..");

        testDataX();
        testDataY();
        testIndividual();

        console.log("Graph tests passed");
    } catch (error) {
        console.error("Graph tests failed:", error);
    }
}
// Assertion function
function assert(condition, message) {
    if (!condition) {
      console.error("Assertion failed:", message);
    } 
}

async function testDataX(){
    const result = ["1/1/2024","11/5/2024","13/5/2024"]
    assert(user_data_x('test', 'wallsit') === result, "user_data_y output not matching expected output");
}

async function testDataY(){
    const result = ["0","18","18"]
    assert(user_data_y('test', 'wallsit') === result, "user_data_x output not matching expected output");
}
  
async function testIndividual(){
    const result = {armcircles: 25, crunches: 20, cycling: 10, run: 40, situps: 26, wallsit: 36};
    assert(individual_type("test", "statsTextUser") === result, "Individual output is not matching the expected output");
}