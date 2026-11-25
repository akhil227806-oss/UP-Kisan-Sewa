import urllib.request
import re

urls = [
    ('JISSS_175388', 'https://epubs.icar.org.in/index.php/JISSS/article/view/175388'),
    ('JISSS_152361', 'https://epubs.icar.org.in/index.php/JISSS/article/view/152361'),
    ('JSWC_153771', 'https://epubs.icar.org.in/index.php/JSWC/article/view/153771'),
    ('JISSS_86460', 'https://epubs.icar.org.in/index.php/JISSS/article/view/86460'),
    ('JISSS_104550', 'https://epubs.icar.org.in/index.php/JISSS/article/view/104550'),
    ('IJAgS_61514', 'https://epubs.icar.org.in/index.php/IJAgS/article/view/61514'),
    ('IJAgS_30373', 'https://epubs.icar.org.in/index.php/IJAgS/article/view/30373'),
    ('JISSS_37753', 'https://epubs.icar.org.in/index.php/JISSS/article/view/37753'),
    ('IJAgS_122214', 'https://epubs.icar.org.in/index.php/IJAgS/article/view/122214'),
    ('IJAgS_137402', 'https://epubs.icar.org.in/index.php/IJAgS/article/view/137402')
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for tag, u in urls:
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            title_m = re.search(r'<meta\s+name=["\']citation_title["\']\s+content=["\'](.*?)["\']', html)
            if not title_m:
                title_m = re.search(r'<h1 class="page_title">\s*(.*?)\s*</h1>', html, re.DOTALL)
            authors = re.findall(r'<meta\s+name=["\']citation_author["\']\s+content=["\'](.*?)["\']', html)
            date_m = re.search(r'<meta\s+name=["\']citation_date["\']\s+content=["\'](.*?)["\']', html)
            pdf_m = re.search(r'<meta\s+name=["\']citation_pdf_url["\']\s+content=["\'](.*?)["\']', html)
            if not pdf_m:
                pdf_m = re.search(r'href=["\'](https://epubs\.icar\.org\.in/index\.php/[^"\']+/download/[^"\']+)["\']', html)
            doi_m = re.search(r'<meta\s+name=["\']citation_doi["\']\s+content=["\'](.*?)["\']', html)
            journal_m = re.search(r'<meta\s+name=["\']citation_journal_title["\']\s+content=["\'](.*?)["\']', html)
            abstract_m = re.search(r'<section class="item abstract">\s*<h2[^>]*>.*?</h2>\s*<p>(.*?)</p>', html, re.DOTALL) or re.search(r'<div class="abstract">(.*?)</div>', html, re.DOTALL)
            
            title = re.sub(r'<[^>]+>', '', title_m.group(1)).strip() if title_m else 'N/A'
            pdf = pdf_m.group(1) if pdf_m else ''
            doi = doi_m.group(1) if doi_m else ''
            date = date_m.group(1) if date_m else ''
            journal = journal_m.group(1) if journal_m else ''
            abstract = re.sub(r'<[^>]+>', '', abstract_m.group(1)).strip() if abstract_m else ''
            abstract = ' '.join(abstract.split())[:300]

            print(f'=== {tag} ===')
            print(f'Title: {title}')
            print(f'Authors: {", ".join(authors)}')
            print(f'Date: {date}')
            print(f'Journal: {journal}')
            print(f'PDF: {pdf}')
            print(f'DOI: {doi}')
            print(f'Abstract: {abstract}')
            print()
    except Exception as e:
        print(f'=== {tag} FAILED ===', e)
