const fs = require('fs');

try {
    const content = fs.readFileSync('lint.json', 'utf8');
    // The content might contain some garbage at the beginning/end if captured from stdout/stderr mixed
    // But usually npm run lint -f json outputs clean JSON if we redirect correctly.
    // However, the previous output showed some "clasfy-app@0.1.0 lint" text.
    // We need to find the JSON array.
    const jsonStart = content.indexOf('[');
    const jsonEnd = content.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd === -1) {
        console.error('Could not find JSON array in lint.json');
        process.exit(1);
    }

    const jsonContent = content.substring(jsonStart, jsonEnd + 1);
    const results = JSON.parse(jsonContent);

    results.forEach(result => {
        if (result.errorCount > 0) {
            console.log(`File: ${result.filePath}`);
            result.messages.forEach(msg => {
                if (msg.severity === 2) { // 2 is error
                    console.log(`  Line ${msg.line}: ${msg.message} (${msg.ruleId})`);
                }
            });
            console.log('---');
        }
    });

} catch (e) {
    console.error('Error parsing lint.json:', e);
}
