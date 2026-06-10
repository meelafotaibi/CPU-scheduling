import os

directory = r"c:\Users\meela\Desktop\OS\cpu\visualizers\cg"
files = [f for f in os.listdir(directory) if f.endswith(".html")]

js_helpers = """
        function getPrimaryColor() {
            return getComputedStyle(document.documentElement).getPropertyValue('--cg-primary').trim() || '#22d3ee';
        }
        function getAccentColor() {
            return getComputedStyle(document.documentElement).getPropertyValue('--cg-accent').trim() || '#a78bfa';
        }
"""

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    has_changes = False

    # Check if this file uses var(--cg-primary) or var(--cg-accent) in JS
    # Usually inside <script>...</script>
    script_match = re = False
    if "var(--cg-primary)" in content or "var(--cg-accent)" in content:
        # Check if they are inside JavaScript (e.g. quote wrapped)
        if "'var(--cg-primary)'" in content or '"var(--cg-primary)"' in content or "'var(--cg-accent)'" in content or '"var(--cg-accent)"' in content:
            # Inject helper functions at the start of script
            if "function getPrimaryColor" not in content:
                content = content.replace("<script>", "<script>\n" + js_helpers)
            
            # Replace quote wrapped CSS variables with helper calls
            content = content.replace("'var(--cg-primary)'", "getPrimaryColor()")
            content = content.replace('"var(--cg-primary)"', "getPrimaryColor()")
            content = content.replace("'var(--cg-accent)'", "getAccentColor()")
            content = content.replace('"var(--cg-accent)"', "getAccentColor()")
            has_changes = True

    if has_changes:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed Canvas colors in {filename}")

print("Done fixing Canvas color bindings.")
