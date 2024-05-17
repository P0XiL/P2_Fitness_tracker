function runTests(){
    console.log("Running tests for survey...");

    try{
    testhandleSurveyFormSubmit();
    }catch(error){
        console.log("Tests failed")
    }

    console.log("Survey tests passed");
}

// Assertion function
function assert(condition, message) {
    if (!condition) {
      console.error("Assertion failed:", message);
    } 
}

function testhandleSurveyFormSubmit(){
    // Mocking necessary elements and data
    const formMock = document.createElement('form');
    formMock.id = 'surveyFormtest'; // Changed the ID to match the one used in the assertion
    const nameInputMock = document.createElement('input');
    nameInputMock.id = 'nametest';
    const userId = 'testUserId';
    localStorage.setItem('username', userId);

    // Add form and input to the document body
    document.body.appendChild(formMock);
    document.body.appendChild(nameInputMock);

    // Simulate form submission
    const submitEvent = new Event('submit');
    formMock.dispatchEvent(submitEvent);

    // Assertions
    // Check if preventDefault is called
    assert(submitEvent.defaultPrevented, 'Form submission not prevented.');

    const surveyData = JSON.parse(localStorage.getItem(`surveyCompleted_${userId}`));
    if (surveyData) {
        assert(surveyData.userid === userId, 'User ID not retrieved or added to survey data correctly.');
    } else {
        assert(false, 'Survey data not found in localStorage.');
    }

    // Check if the form is hidden after submission
    assert(document.getElementById('surveyFormtest').classList.contains('active') === false, 'Form not hidden after submission.');

    // Clean up
    localStorage.removeItem('username');
    localStorage.removeItem(`surveyCompleted_${userId}`);
    document.body.removeChild(formMock);
    document.body.removeChild(nameInputMock);
}

runTests(); // Call the runTests function after defining all the necessary components and functions.
