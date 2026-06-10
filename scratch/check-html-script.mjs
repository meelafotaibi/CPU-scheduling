import { readFile } from 'node:fs/promises';

async function checkInlineScript(filePath) {
    console.log(`Checking ${filePath}...`);
    const content = await readFile(filePath, 'utf8');
    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    let match;
    let index = 0;
    while ((match = scriptRegex.exec(content)) !== null) {
        const scriptContent = match[1];
        if (scriptContent.trim().length === 0) continue;
        try {
            // Compile without executing
            new Function(scriptContent);
            console.log(`  Script block ${index} OK`);
        } catch (err) {
            console.error(`  Script block ${index} HAS SYNTAX ERROR:`);
            console.error(err);
        }
        index++;
    }
}

await checkInlineScript('visualizers/dsa/linked-list.html');
await checkInlineScript('visualizers/dsa/stack-queue.html');
