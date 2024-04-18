document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        const userPreferences = JSON.stringify({ survey: data });
        localStorage.setItem("preferences", userPreferences);
        console.log(userPreferences);

        function sendPreferences(userPreferences) {
            fetch('http://127.0.0.1:3360/userPreferences', { // Change this to either https://cs-24-sw-2-06.p2datsw.cs.aau.dk/node4/writeUserData, or http://127.0.0.1:3364/writeUserData depending on localhost or server host
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userPreferences)
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Data successfully sent to server');

                        // Hide the form
                        document.getElementById("surveyContainer").style.display = "none";

                        // Display the submission message
                        document.getElementById("submissionMessage").style.display = "block";

                        document.getElementById('main').classList.add('active');
                        document.getElementById('surveyForm').classList.remove('active');
                    }
                });
        }

        sendPreferences(userPreferences);
    });
});


