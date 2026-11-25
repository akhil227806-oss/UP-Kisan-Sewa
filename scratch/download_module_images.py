import urllib.request
import os

os.makedirs('c:/Users/dines/Downloads/Akhil sir Project/UP-Kisan-Sewa/frontend/public/modules', exist_ok=True)

module_images = {
    "crop-info.jpg": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    "mandi-prices.jpg": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    "weather-forecast.jpg": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",
    "gov-schemes.jpg": "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
    "crop-diseases.jpg": "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80",
    "pest-management.jpg": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    "crop-calendar.jpg": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    "soil-health.jpg": "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80",
    "farm-machinery.jpg": "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
    "kvk-universities.jpg": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    "knowledge-center.jpg": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    "helpline.jpg": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
}

headers = {'User-Agent': 'Mozilla/5.0'}

for name, url in module_images.items():
    dst = os.path.join('c:/Users/dines/Downloads/Akhil sir Project/UP-Kisan-Sewa/frontend/public/modules', name)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            with open(dst, 'wb') as f:
                f.write(resp.read())
        print(f"Downloaded {name} ({os.path.getsize(dst)} bytes)")
    except Exception as e:
        print(f"Failed {name}: {e}")

print("All module images processed!")
