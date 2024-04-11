function test() {
    const obj_newQuest = {
        pog: {
            pogchamp: "pogchamp"
        },
        champ: "champ"
    }


    fetch('json/test.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj_newQuest)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch second endpoint');
            }
            return response.json();
        })
        .then(dataFromSecondEndpoint => {


            // Use data from the second endpoint
            console.log('Data from second endpoint:', dataFromSecondEndpoint);
        })
        .catch(error => {
            console.error('Error fetching second endpoint:', error);
        });
}