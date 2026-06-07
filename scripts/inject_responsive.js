const fs = require('fs');
const path = require('path');

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

    // Remove old responsive.css link if exists (without version) to avoid dupes if re-run
    if (content.includes('responsive.css"')) {
        // check if it has version
        if (content.includes('v=mobile_fix_1')) {
            console.log(`Skipping ${filePath} - already updated`);
            return;
        }
    }

    // Determine correct path prefix based on main.css or file depth
    let cssPath = 'assets/css/responsive.css';
    if (content.includes('href="../assets/css/main.css"')) {
        cssPath = '../assets/css/responsive.css';
    } else if (content.includes('href="../../assets/css/main.css"')) {
        cssPath = '../../assets/css/responsive.css';
    } else if (content.includes('href="assets/css/main.css"')) {
        cssPath = 'assets/css/responsive.css';
    } else {
        // Fallback based on path
        if (filePath.includes('visualizers')) cssPath = '../assets/css/responsive.css';
    }

    const linkTag = `<link rel="stylesheet" href="${cssPath}?v=mobile_fix_1">`;

    // Insert after main.css if possible (for cascade), or before </head>
    // Searching for main.css link closing tag
    if (content.includes('href="../assets/css/main.css">')) {
        const target = 'href="../assets/css/main.css">';
        const newContent = content.replace(target, target + '\n    ' + linkTag);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath} (after main.css)`);
    } else if (content.includes('href="assets/css/main.css">')) {
        const target = 'href="assets/css/main.css">';
        const newContent = content.replace(target, target + '\n    ' + linkTag);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath} (after main.css)`);
    } else if (content.includes('</head>')) {
        const newContent = content.replace('</head>', `    ${linkTag}\n</head>`);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath} (head end)`);
    } else {
        console.log(`Skipping ${filePath} - cannot find insertion point`);
    }
}

processDir(path.join(__dirname, '..'));
