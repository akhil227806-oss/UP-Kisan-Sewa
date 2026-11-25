import urllib.request
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def search_icar(query, journal='IJAgS', max_results=5):
    url = f"https://epubs.icar.org.in/index.php/{journal}/search/search?query={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            articles = []
            matches = re.findall(r'<h3 class="title">\s*<a\s+href="([^"]+)">\s*(.*?)\s*</a>\s*</h3>', html)
            for href, title in matches[:max_results]:
                clean_title = re.sub(r'<[^>]+>', '', title).strip()
                articles.append({'url': href, 'title': clean_title})
            return articles
    except Exception as e:
        print(f"Error searching {journal} for {query}:", e)
        return []

searches = [
    ('Wheat Research', [('wheat heat stress terminal', 'IJAgS'), ('wheat zero tillage yield', 'IJAgS')]),
    ('Rice Research', [('direct seeded rice weed', 'IJAgS'), ('system of rice intensification SRI', 'IJAgS')]),
    ('Soil Science & Soil Health', [('soil organic carbon sequestration Gangetic', 'JISSS')]),
    ('Crop Nutrition & Fertilizer Management', [('nano urea foliar nutrition wheat', 'IJAgS'), ('zinc biofortification wheat rice', 'IJAgS')]),
    ('Plant Disease & Pest Management', [('yellow rust wheat stripe rust', 'IJAgS'), ('brown plant hopper rice management', 'IJAgS'), ('blight disease management bio control', 'IJAgS')]),
    ('Horticulture & Vegetable Production', [('tomato drip fertigation yield', 'IJAgS'), ('polyhouse vegetable protected cultivation', 'IJAgS')]),
    ('Organic & Natural Farming', [('natural farming cow based Panchagavya', 'IJAgS'), ('organic farming soil biological activity', 'IJAgS')]),
    ('Irrigation & Water Management', [('drip irrigation water productivity Indo Gangetic', 'IJAgS'), ('alternate wetting and drying AWD rice', 'IJAgS')]),
    ('Climate-Smart Agriculture', [('climate resilient agriculture contingent crop', 'IJAgS'), ('carbon footprint conservation agriculture', 'IJAgS')]),
    ('Agricultural Technology & AI', [('drone sensor precision agriculture yield', 'IJAgS'), ('machine learning crop yield disease', 'IJAgS')])
]

results = {}
for cat, query_list in searches:
    results[cat] = []
    for q, j in query_list:
        found = search_icar(q, j, 4)
        for f in found:
            results[cat].append(f)

with open('scratch/found_articles.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Search completed!")
for cat, items in results.items():
    print(f"{cat}: {len(items)} found")
