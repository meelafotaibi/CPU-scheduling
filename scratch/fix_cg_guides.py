import os
import re

directory = r"c:\Users\meela\Desktop\OS\cpu\guides\cg"

# MathJax head script to inject
mathjax_head = """    <!-- MathJax Setup -->
    <script>
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
            }
        };
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
"""

def process_html_content(content):
    # 1. Inject MathJax if not present
    if "MathJax-script" not in content:
        content = content.replace("</head>", mathjax_head + "</head>")

    # 2. Find all <p>...</p> blocks and replace formatting inside them.
    def replace_paragraph(match):
        p_content = match.group(1)
        
        # Replace Z\_Buffer or similar escaped underscores:
        p_content = p_content.replace("\\_", "_")
        
        # Replace inline bolding: **text** -> <strong>text</strong>
        p_content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', p_content)
        
        # Replace inline code backticks: `code` -> <code>code</code>
        p_content = re.sub(r'`(.*?)`', r'<code>\1</code>', p_content)

        lines = p_content.split('\n')
        blocks = []
        current_text_block = []
        current_list_block = []
        list_type = None # 'ul' or 'ol'
        
        def flush_text():
            if current_text_block:
                text = '\n'.join(current_text_block).strip()
                if text:
                    blocks.append(f"<p>{text}</p>")
                current_text_block.clear()
                
        def flush_list():
            if current_list_block:
                list_items = '\n'.join(current_list_block)
                blocks.append(f"<{list_type}>\n{list_items}\n</{list_type}>")
                current_list_block.clear()

        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
                
            # Unordered list item
            if stripped.startswith('- ') or stripped.startswith('* '):
                if list_type != 'ul':
                    flush_text()
                    flush_list()
                    list_type = 'ul'
                li_content = stripped[2:].strip()
                current_list_block.append(f"    <li>{li_content}</li>")
                
            # Ordered list item
            elif re.match(r'^\d+\.\s+', stripped):
                if list_type != 'ol':
                    flush_text()
                    flush_list()
                    list_type = 'ol'
                m = re.match(r'^\d+\.\s+(.*)', stripped)
                li_content = m.group(1).strip()
                current_list_block.append(f"    <li>{li_content}</li>")
                
            # Regular text line
            else:
                if list_type is not None:
                    flush_list()
                    list_type = None
                current_text_block.append(line)
                
        flush_text()
        flush_list()
        
        return '\n'.join(blocks)

    # Replace all <p>...</p> tags
    content = re.sub(r'<p>(.*?)</p>', replace_paragraph, content, flags=re.DOTALL)

    return content

# Iterate over all files in the directory
for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        print(f"Processing: {filename}")
        new_content = process_html_content(content)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)

print("All guides fixed successfully!")
