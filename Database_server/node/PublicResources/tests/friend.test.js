function runTests() {
    console.log("Running tests...");

    // Test adding a friend
    testAddFriend()
        .then(() => {
            // Test deleting a friend
            return testDeleteFriend();
        })
        .then(() => {
            console.log("All tests passed");
        })
        .catch(error => {
            console.error("Test failed:", error);
        });
}


// Function to test adding a friend
function testAddFriend() {
    const friendData = {
        username: 'Lenny',
        friends: 'Tobi'
    };

    return fetch(serverPath + 'addFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(friendData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add friend');
        }
        return response.json();
    });
}

// Function to test deleting a friend
function testDeleteFriend() {
    const friendData = {
        username: 'Lenny',
        friend: 'Tobi'
    };

    return fetch(serverPath + 'deleteFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(friendData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete friend');
        }
        return response.json();
    });
}
