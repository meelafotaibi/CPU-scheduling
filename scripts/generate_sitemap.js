const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://cpuos-ae329.web.app';
const TODAY = new Date().toISOString().split('T')[0];

const priorities = {
    'index.html': 1.0,
    'os.html': 0.9,
    'dsa.html': 0.9,
    'algorithms.html': 0.9,
    'ai.html': 0.9,
    'roadmap.html': 0.8,
    'privacy.html': 0.3,
    'terms.html': 0.3,
    'contact.html': 0.3,
    'support.html': 0.3,
    'default': 0.8
};

const changefreqs = {
    'index.html': 'weekly',
    'default': 'monthly'
};

function getFiles(dir, fileList = [], rootDir = '') {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (file !== '.git' && file !== '.firebase' && file !== 'node_modules' && file !== 'assets') {
                getFiles(filePath, fileList, rootDir || dir);
            }
        } else {
            if (file.endsWith('.html') && !file.startsWith('google') && file !== '404.html') {
                // Rel path from root
                let relPath = path.relative(rootDir || '.', filePath).replace(/\\/g, '/');
                if (rootDir && !relPath.startsWith(path.basename(dir))) {
                    // fix for recursion if needed, but path.relative should handle it if CWD is correct
                }
                fileList.push(relPath);
            }
        }
    });
    return fileList;
}

const allFiles = getFiles(path.join(__dirname, '..'));

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

allFiles.forEach(file => {
    let url = file.replace('.html', '');
    if (url === 'index') url = ''; // Root

    // Clean URLs: just remove .html
    // If it's a subfolder like guides/cpu-scheduling, file is guides/cpu-scheduling.html -> guides/cpu-scheduling

    const fullUrl = `${BASE_URL}/${url}`;

    // Determine priority
    let priority = priorities[path.basename(file)] || priorities['default'];
    // Adjust priority for subfolders if not explicitly set?
    // Visualizers are high value, keep 0.8

    let freq = changefreqs[path.basename(file)] || changefreqs['default'];

    sitemap += '  <url>\n';
    sitemap += `    <loc>${fullUrl}</loc>\n`;
    sitemap += `    <lastmod>${TODAY}</lastmod>\n`;
    sitemap += `    <changefreq>${freq}</changefreq>\n`;
    sitemap += `    <priority>${priority}</priority>\n`;
    sitemap += '  </url>\n';
});

sitemap += '</urlset>';

fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemap);
console.log(`Generated sitemap.xml with ${allFiles.length} URLs`);
