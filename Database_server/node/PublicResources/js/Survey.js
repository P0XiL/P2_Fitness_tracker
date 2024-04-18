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

        function sendPreferences(data) {
            fetch('http://127.0.0.1:3360/json/userPreferences.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    console.log('Data successfully sent to server');
                    const userPreferences = {
                        Name: Name,
                        Age: age,
                        Height: height,
                        Weight: weight,
                        Goals: goals,
                        Activity: activity
                    };
                    sendPreferences(userPreferences);
        
                    // Display the submission message
                    document.getElementById("submissionMessage").style.display = "block";
        
                    document.getElementById('main').classList.add('active');
                    document.getElementById('surveyForm').classList.remove('active');
                } else {
                    console.error('Failed to send data to server');
                }
            })
            .catch(error => {
                console.error('Error occurred while sending data to server:', error);
            });
        }
    });
});
