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
        
        const preferences = JSON.stringify({ survey: data });
        localStorage.setItem("preferences", preferences);
        console.log(preferences);
    });
});


