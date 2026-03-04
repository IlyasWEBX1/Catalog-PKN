import requests
import random
from datetime import datetime, timedelta

API_BASE = "https://django-backend-production-a01f.up.railway.app/Catalogue_api"

def get_historical_date():
    # Menghasilkan tanggal acak antara tahun 2021 hingga 2024
    start_date = datetime(2021, 1, 1)
    end_date = datetime(2024, 12, 31)
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + timedelta(days=random_number_of_days)
    return random_date.strftime('%Y-%m-%d')

def inject_bulk_laporan(n=20):
    # Setup Data Dasar
    product_list = [
        {"id": 5, "nama": "Maroon Series - Panci", "harga": 790000},
        {"id": 3, "nama": "Pan Cake", "harga": 350000},
    ]
    user_admin_id = 1 # Sesuaikan ID Admin Anda

    print(f"🚀 Memulai Injeksi {n} Laporan Historis ke {API_BASE}/inject-laporan/...")

    for i in range(n):
        produk = random.choice(product_list)
        qty = random.randint(1, 5)
        total_rev = produk['harga'] * qty
        tgl = get_historical_date()

        payload = {
            "user_admin_id": user_admin_id,
            "tanggal": tgl,
            "nama_pembeli": f"Pembeli Historis {i+1}",
            "product_id": produk['id'],
            "qty": qty,
            "harga_satuan": produk['harga'],
            "total_revenue": total_rev
        }

        try:
            # Gunakan endpoint baru inject-laporan
            response = requests.post(f"{API_BASE}/inject-laporan/", json=payload)
            
            if response.status_code == 201:
                print(f"✅ [{i+1}] Sukses: {produk['nama']} | Tanggal: {tgl} | Rp{total_rev}")
            else:
                print(f"❌ [{i+1}] Gagal: {response.text}")
        except Exception as e:
            print(f"🔥 Error: {e}")

if __name__ == "__main__":
    inject_bulk_laporan(30) # Suntik 30 data sekaligus