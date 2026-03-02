import os
import re
import urllib.request

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
os.makedirs('images', exist_ok=True)

url_pattern = re.compile(r'http://thevalues\.kr/data/board/[^"\'\s]+')
url_map = {}

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    urls = url_pattern.findall(content)
    for url in urls:
        if url not in url_map:
            # Generate a local filename
            # Some URLs have weird chars, use a clean index-based name
            ext = url.split('.')[-1]
            if not ext.isalpha(): ext = "jpg"
            prefix = "team" if "sub1_2" in url else "book"
            local_name = f"{prefix}_{len(url_map):02d}.{ext}"
            local_path = "images/" + local_name
            url_map[url] = local_path
            
            print(f"Downloading {url} to {local_path}...")
            try:
                # Add headers to avoid 403
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response, open(local_path, 'wb') as out_file:
                    out_file.write(response.read())
            except Exception as e:
                print(f"Failed to download {url}: {e}")

    # Now replace in file
    for url, local_path in url_map.items():
        content = content.replace(url, local_path)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done downloading and replacing images.")
