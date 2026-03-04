import requests
import random
from datetime import datetime, timedelta

API_BASE = "https://django-backend-production-a01f.up.railway.app/Catalogue_api"

def get_dynamic_data(current_date):
    """
    Simulates business logic: 
    - Weekend sales are higher.
    - Sales grow slightly every year.
    """
    base_qty = random.randint(1, 3)
    
    # Weekend boost (Friday-Sunday)
    if current_date.weekday() >= 4:
        base_qty += random.randint(2, 5)
        
    # Yearly growth (2021 is slower than 2024)
    growth_boost = (current_date.year - 2021) * 1 
    
    return base_qty + growth_boost

def inject_clean_history():
    product_list = [
        {"id": 5, "nama": "Maroon Series - Panci", "harga": 780000},
        {"id": 3, "nama": "Pan Cake", "harga": 350000},
    ]
    
    start_date = datetime(2021, 1, 1)
    end_date = datetime.now()
    current_date = start_date

    print("🚀 Starting Professional Data Injection...")

    while current_date <= end_date:
        # We don't sell every single day, let's say 40% chance of a sale
        if random.random() < 0.4:
            produk = random.choice(product_list)
            qty = get_dynamic_data(current_date)
            total_rev = produk['harga'] * qty

            payload = {
                "user_admin_id": 1,
                "tanggal": current_date.strftime('%Y-%m-%d'),
                "nama_pembeli": f"Customer_{current_date.strftime('%y%m%d')}",
                "product_id": produk['id'],
                "qty": qty,
                "harga_satuan": produk['harga'],
                "total_revenue": total_rev
            }

            try:
                r = requests.post(f"{API_BASE}/inject-laporan/", json=payload)
                if r.status_code == 201:
                    print(f"✅ {current_date.date()} | {produk['nama']} | Qty: {qty}")
            except Exception as e:
                print(f"❌ Error at {current_date}: {e}")
        
        # Move to next day
        current_date += timedelta(days=random.randint(1, 3))

if __name__ == "__main__":
    inject_clean_history()