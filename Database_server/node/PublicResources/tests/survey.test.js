
//runTests();
function runTests(){
    console.log("Running tests...");

    testhandleSurveyFormSubmit();

    console.log("All tests passed");
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
    formMock.id = 'surveyForm';
    const nameInputMock = document.createElement('input');
    nameInputMock.id = 'name';
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

    // Check if user ID is retrieved from local storage and added to survey data
    const surveyData = JSON.parse(localStorage.getItem(`surveyCompleted_${userId}`));
    assert(surveyData.userid === userId, 'User ID not retrieved or added to survey data correctly.');

    // Check if the form is hidden after submission
    assert(document.getElementById('surveyForm').classList.contains('active') === false, 'Form not hidden after submission.');

    // Clean up
    localStorage.removeItem('username');
    localStorage.removeItem(`surveyCompleted_${userId}`);
    document.body.removeChild(formMock);
    document.body.removeChild(nameInputMock);
}