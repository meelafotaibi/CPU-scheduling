const fs = require('fs');
const path = require('path');

const AD_CODE = `
<div class="adsbygoogle-container" style="margin: 40px 0; text-align: center;">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6906580768177940" crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-format="autorelaxed"
         data-ad-client="ca-pub-6906580768177940"
         data-ad-slot="9009736994"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (file !== '.git' && file !== '.firebase' && file !== 'node_modules') {
                processDir(filePath);
            }
        } else if (file.endsWith('.html')) {
            updateFile(filePath);
        }
    }
}

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already has this specific slot
    if (content.includes('data-ad-slot="9009736994"')) {
        console.log(`Skipping ${filePath} - already has ad unit`);
        return;
    }

    let updated = false;

    // Strategy 1: Replace placeholder ID 1234567890
    if (content.includes('data-ad-slot="1234567890"')) {
        // Try to replace the parent div if probable
        const regex = /<div[^>]*>\s*<ins[^>]*data-ad-slot="1234567890"[^>]*>[\s\S]*?<\/script>\s*<\/div>/;
        if (regex.test(content)) {
            content = content.replace(regex, AD_CODE);
            updated = true;
            console.log(`Updated ${filePath} (replaced placeholder)`);
        } else {
            // simpler replacement if logic fails
            content = content.replace('data-ad-slot="1234567890"', 'data-ad-slot="9009736994" data-ad-format="autorelaxed"');
            updated = true;
            console.log(`Updated ${filePath} (patched placeholder ID)`);
        }
    }

    // Strategy 2: Update empty/existing .adsbygoogle-container
    if (!updated && content.includes('class="adsbygoogle-container"')) {
        const regex = /<div class="adsbygoogle-container"[^>]*>[\s\S]*?<\/div>/;
        content = content.replace(regex, AD_CODE);
        updated = true;
        console.log(`Updated ${filePath} (filled container)`);
    }

    // Strategy 3: Insert at bottom of main
    if (!updated) {
        if (content.includes('</main>')) {
            content = content.replace('</main>', `${AD_CODE}\n</main>`);
            updated = true;
            console.log(`Updated ${filePath} (appended to main)`);
        } else if (content.includes('<footer')) {
            content = content.replace('<footer', `${AD_CODE}\n<footer`);
            updated = true;
            console.log(`Updated ${filePath} (before footer)`);
        }
    }

    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
    } else {
        console.log(`Skipping ${filePath} - no suitable insertion point`);
    }
}

processDir('.');
