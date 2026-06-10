import os
import re

directory = r"c:\Users\meela\Desktop\OS\cpu\visualizers\cg"
files = [f for f in os.listdir(directory) if f.endswith(".html")]

js_helpers_old = """        function getPrimaryColor() {
            return getComputedStyle(document.documentElement).getPropertyValue('--cg-primary').trim() || '#22d3ee';
        }
        function getAccentColor() {
            return getComputedStyle(document.documentElement).getPropertyValue('--cg-accent').trim() || '#a78bfa';
        }"""

js_helpers_updated = """        function getPrimaryColor() {
            return getComputedStyle(document.documentElement).getPropertyValue('--cg-primary').trim() || '#22d3ee';
        }
        function getAccentColor() {
            return getComputedStyle(document.documentElement).getPropertyValue('--cg-accent').trim() || '#a78bfa';
        }
        function hexToRgba(hex, alpha) {
            if (hex.startsWith('hsl')) {
                return hex.replace('hsl', 'hsla').replace(')', `, ${alpha})`);
            }
            let c;
            if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                c= hex.substring(1).split('');
                if(c.length== 3){
                    c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c= '0x'+c.join('');
                return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
            }
            return hex;
        }
        function getPrimaryColorRgba(alpha) {
            return hexToRgba(getPrimaryColor(), alpha);
        }
        function getAccentColorRgba(alpha) {
            return hexToRgba(getAccentColor(), alpha);
        }
        function getPrimaryColorRgb() {
            let hex = getPrimaryColor();
            let r = 34, g = 211, b = 238;
            if (hex.startsWith('hsl')) {
                let match = hex.match(/\\d+/g);
                if (match) {
                    let h = parseInt(match[0]);
                    let s = parseInt(match[1]) / 100;
                    let l = parseInt(match[2]) / 100;
                    let c = (1 - Math.abs(2 * l - 1)) * s;
                    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
                    let m = l - c/2;
                    let r_ = 0, g_ = 0, b_ = 0;
                    if (h >= 0 && h < 60) { r_ = c; g_ = x; b_ = 0; }
                    else if (h >= 60 && h < 120) { r_ = x; g_ = c; b_ = 0; }
                    else if (h >= 120 && h < 180) { r_ = 0; g_ = c; b_ = x; }
                    else if (h >= 180 && h < 240) { r_ = 0; g_ = x; b_ = c; }
                    else if (h >= 240 && h < 300) { r_ = x; g_ = 0; b_ = c; }
                    else if (h >= 300 && h < 360) { r_ = c; g_ = 0; b_ = x; }
                    r = Math.round((r_ + m) * 255);
                    g = Math.round((g_ + m) * 255);
                    b = Math.round((b_ + m) * 255);
                }
            } else if (hex.startsWith('#')) {
                let c = hex.substring(1).split('');
                if (c.length === 3) {
                    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                let val = parseInt(c.join(''), 16);
                r = (val >> 16) & 255;
                g = (val >> 8) & 255;
                b = val & 255;
            }
            return { r, g, b };
        }"""

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace the helper function block
    if js_helpers_old in content:
        content = content.replace(js_helpers_old, js_helpers_updated)
    elif "function getPrimaryColor" in content:
        pattern = r"function getPrimaryColor\(\)\s*\{[^}]*\}\s*function getAccentColor\(\)\s*\{[^}]*\}"
        content = re.sub(pattern, lambda m: js_helpers_updated, content)
    else:
        # If it doesn't exist, inject it right after the first <script> tag
        content = content.replace("<script>", "<script>\n" + js_helpers_updated)

    # 2. Remove the duplicate setDrawColor inside the script tag with src
    src_script_pattern = r'<script src="\.\./\.\./assets/js/brain-animation\.js">\s*function setDrawColor[^<]*</script>'
    content = re.sub(src_script_pattern, lambda m: '<script src="../../assets/js/brain-animation.js"></script>', content)

    # 3. Canvas Background replacements
    # Replace solid fills on ctx with clearRect
    # e.g., ctx.fillStyle = '#0f051d'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    bg_pattern_1 = r"ctx\.fillStyle\s*=\s*['\"]#0f051[dD]['\"];\s*ctx\.fillRect\(0,\s*0,\s*canvas\.width,\s*canvas\.height\);"
    content = re.sub(bg_pattern_1, lambda m: "ctx.clearRect(0, 0, canvas.width, canvas.height);", content)

    bg_pattern_2 = r"ctx\.fillStyle\s*=\s*['\"]#0f051[dD]['\"];\s*ctx\.fillRect\(0,\s*0,\s*canvasColor\.width,\s*canvasColor\.height\);"
    content = re.sub(bg_pattern_2, lambda m: "ctx.clearRect(0, 0, canvas.width, canvas.height);", content)

    # Specific replacements for individual files
    if filename == "bezier.html":
        content = content.replace("ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';", "ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';")
        content = content.replace("ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';", "ctx.strokeStyle = getPrimaryColorRgba(0.4);")
        content = content.replace("ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';", "ctx.strokeStyle = getAccentColorRgba(0.4);")
        content = content.replace("ctx.fillStyle = '#ef4444';", "ctx.fillStyle = getAccentColor();")
        content = content.replace("ctx.fillStyle = 'var(--monster-success)';", "ctx.fillStyle = getPrimaryColor();")
        content = content.replace("ctx.strokeStyle = 'var(--monster-success)';", "ctx.strokeStyle = getPrimaryColor();")
        content = content.replace("ctx.fillStyle = '#eee';", "ctx.fillStyle = '#fff';")

    elif filename == "cohen-sutherland.html":
        content = content.replace("ctx.fillStyle = 'rgba(6, 182, 212, 0.06)';", "ctx.fillStyle = getPrimaryColorRgba(0.08);")
        content = content.replace("ctx.strokeStyle = 'var(--monster-success)';", "ctx.strokeStyle = getPrimaryColor();")

    elif filename == "dda-bresenham.html":
        content = content.replace("ctx.strokeStyle = 'rgba(255, 107, 107, 0.4)';", "ctx.strokeStyle = getAccentColorRgba(0.5);")

    elif filename == "polygon-fill.html":
        content = content.replace("ctx.fillStyle = y === scanlineY ? getPrimaryColor() : 'rgba(6, 182, 212, 0.2)';",
                                  "ctx.fillStyle = y === scanlineY ? getPrimaryColor() : getPrimaryColorRgba(0.25);")

    elif filename == "shading-models.html":
        sphere_rgb_old = """// Map intensity to RGB (cyan base)
                        let pixelIdx = ((y + radius) * radius * 2 + (x + radius)) * 4;
                        imgData.data[pixelIdx] = Math.floor(Math.max(0, Math.min(255, 6 * shade)));     // R
                        imgData.data[pixelIdx + 1] = Math.floor(Math.max(0, Math.min(255, 182 * shade))); // G
                        imgData.data[pixelIdx + 2] = Math.floor(Math.max(0, Math.min(255, 212 * shade))); // B"""
        
        sphere_rgb_new = """// Map intensity to RGB (dynamic base)
                        const baseColor = getPrimaryColorRgb();
                        let pixelIdx = ((y + radius) * radius * 2 + (x + radius)) * 4;
                        imgData.data[pixelIdx] = Math.floor(Math.max(0, Math.min(255, baseColor.r * shade)));     // R
                        imgData.data[pixelIdx + 1] = Math.floor(Math.max(0, Math.min(255, baseColor.g * shade))); // G
                        imgData.data[pixelIdx + 2] = Math.floor(Math.max(0, Math.min(255, baseColor.b * shade))); // B"""
        content = content.replace(sphere_rgb_old, sphere_rgb_new)

    elif filename == "sutherland-hodgman.html":
        content = content.replace("ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';", "ctx.fillStyle = getPrimaryColorRgba(0.08);")

    elif filename == "texture-mapping.html":
        content = content.replace("ctx2D.fillStyle = '#111';", "ctx2D.clearRect(0, 0, canvas2D.width, canvas2D.height);")
        content = content.replace("ctx3D.fillStyle = '#04040a';", "ctx3D.clearRect(0, 0, canvas3D.width, canvas3D.height);")
        content = content.replace("ctx2D.fillStyle = 'rgba(6, 182, 212, 0.4)';", "ctx2D.fillStyle = getPrimaryColorRgba(0.4);")
        content = content.replace("ctx3D.fillStyle = 'rgba(6, 182, 212, 0.2)';", "ctx3D.fillStyle = getPrimaryColorRgba(0.2);")

    elif filename == "z-buffer.html":
        content = content.replace("ctxColor.fillStyle = '#04040a';", "ctxColor.clearRect(0, 0, canvasColor.width, canvasColor.height);")
        content = content.replace("ctxColor.strokeStyle = 'rgba(255,255,255,0.08)';", "ctxColor.strokeStyle = getPrimaryColorRgba(0.3);")

    elif filename == "glut.html":
        glut_bg_old = r"if\s*\(isSingle\)\s*\{\s*if\s*\(phase\s*===\s*0\)\s*\{\s*ctx\.fillStyle\s*=\s*['\"]#0f051[dD]['\"];\s*ctx\.fillRect\(0,\s*0,\s*canvas\.width,\s*canvas\.height\);\s*//\s*Clears\s*to\s*purple,\s*creating\s*flash\s*return;\s*\}\s*\}\s*else\s*\{\s*ctx\.fillStyle\s*=\s*['\"]#0f051[dD]['\"];\s*ctx\.fillRect\(0,\s*0,\s*canvas\.width,\s*canvas\.height\);\s*\}"
        glut_bg_new = """if (isSingle) {
                if (phase === 0) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears to transparent, creating flash
                    return;
                }
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }"""
        content = re.sub(glut_bg_old, lambda m: glut_bg_new, content)

    # Save changes
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully processed {filename}")

print("All visualizer backgrounds and drawing colors have been fully updated.")
