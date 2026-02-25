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

    // Check if favicon already exists
    if (content.includes('rel="icon"') || content.includes('rel="shortcut icon"')) {
        console.log(`Skipping ${filePath} - already has favicon`);
        return;
    }

    // Determine correct path prefix
    let iconPath = 'assets/img/logo.png';
    // Heuristic based on main.css link or manual depth check
    if (content.includes('href="../assets/css/main.css"') || content.includes('href="../assets/')) {
        iconPath = '../assets/img/logo.png';
    } else if (content.includes('href="../../assets/css/main.css"') || content.includes('href="../../assets/')) {
        iconPath = '../../assets/img/logo.png';
    } else if (content.includes('href="assets/css/main.css"')) {
        iconPath = 'assets/img/logo.png';
    } else {
        // Fallback for visualizers and guides
        if (filePath.includes('visualizers') || filePath.includes('guide')) iconPath = '../assets/img/logo.png';
    }

    const linkTag = `<link rel="icon" href="${iconPath}" type="image/png">`;

    // Insert before </head>
    if (content.includes('</head>')) {
        const newContent = content.replace('</head>', `    ${linkTag}\n</head>`);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`Skipping ${filePath} - no </head> tag found`);
    }
}

processDir('.');
