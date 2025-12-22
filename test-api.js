
// const fetch = require('node-fetch'); // Native fetch in Node 18+

const API_URL = "https://script.google.com/macros/s/AKfycbx_UlUFdK-s1M892_uGhqs5ObNQcgPrNifG8kamrYMbRTFcDJgvNbKgO9cMjjwi_dPbvQ/exec";

async function testConnection() {
    console.log("Testing connection to:", API_URL);

    const payload = {
        action: "sync",
        payload: [
            {
                action: "CREATE",
                table: "posts",
                data: {
                    id: Date.now(),
                    title: "Test Post via Sync",
                    content: "Testing sync action",
                    author: "Admin",
                    date: new Date().toISOString(),
                    status: "Active",
                    type: "announcement",
                    comments: []
                }
            }
        ]
    };

    try {
        const urlWithAction = `${API_URL}?action=sync`;
        console.log("Fetching from:", urlWithAction);

        const response = await fetch(urlWithAction); // Default is GET

        const text = await response.text();
        console.log("Response Status:", response.status);
        console.log("Response Body:", text);

        try {
            const json = JSON.parse(text);
            console.log("Parsed JSON:", json);
        } catch (e) {
            console.log("Response is not JSON");
        }

    } catch (error) {
        console.error("Connection failed:", error);
    }
}

testConnection();
