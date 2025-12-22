const https = require('https');

const API_URL = 'https://script.google.com/macros/s/AKfycbx_UlUFdK-s1M892_uGhqs5ObNQcgPrNifG8kamrYMbRTFcDJgvNbKgO9cMjjwi_dPbvQ/exec';

const payload = {
    action: 'sync',
    payload: [
        {
            id: `DEBUG_${Date.now()}`,
            action: 'CREATE',
            table: 'challenge_completions',
            data: {
                id: `DEBUG_${Date.now()}`,
                challengeId: 12345,
                studentId: 67890,
                timestamp: new Date().toISOString()
            }
        }
    ]
};

console.log("Sending payload:", JSON.stringify(payload, null, 2));

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain' // GAS requires text/plain or it might try to parse as form data
    }
};

const req = https.request(API_URL, options, (res) => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);

    if (res.statusCode === 302) {
        console.log("Redirect location:", res.headers.location);
        // Follow redirect manually if needed, but usually https.request handles it or we need a library like axios. 
        // Actually https.request does NOT follow redirects automatically.
        // Let's use a simple fetch-like approach if node version supports it, or handle redirect.
        // For simplicity in this environment, I'll assume we might need to handle the redirect.

        const newUrl = res.headers.location;
        console.log("Following redirect to:", newUrl);
        const req2 = https.request(newUrl, options, (res2) => {
            let data2 = '';
            res2.on('data', (chunk) => data2 += chunk);
            res2.on('end', () => {
                console.log("Response Body:", data2);
            });
        });
        req2.write(JSON.stringify(payload));
        req2.end();
        return;
    }

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log("Response Body:", data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(JSON.stringify(payload));
req.end();
