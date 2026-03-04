import requests
import random
from datetime import datetime, timedelta

# URL Production Railway Anda
API_BASE = "https://django-backend-production-a01f.up.railway.app/Catalogue_api"

def get_random_past_date():
    """Menghasilkan string tanggal acak antara 1 sampai 30 hari yang lalu"""
    random_days = random.randint(365*3, 365*5)  # 3-5 tahun lalu
    past_date = datetime.now() - timedelta(days=random_days)
    # Format yang dikenali Django: YYYY-MM-DD HH:MM:SS
    return past_date.strftime('%Y-%m-%d %H:%M:%S')

def generate_bulk_messages():
    # 1. Setup Data (Sesuaikan ID produk yang ada di DB Anda)
    product_ids = [1, 2, 3, 4, 5, 6, 7] 
    user_id = 4 # ID untuk 'ilyas2'
    
    print(f"🚀 Memulai pengiriman pesan ke {API_BASE}/send-message/...")

    for i in range(20): # Kita kirim 20 pesan acak
        random_date = get_random_past_date()
        
        payload = {
            "product_id": random.choice(product_ids),
            "message": f"Order Simulasi (Data Historis {random_date})",
            "user_id": user_id,
            "waktu_custom": random_date  # Field tambahan untuk ditangkap Backend
        }
        
        try:
            # Kirim POST request
            response = requests.post(f"{API_BASE}/send-message/", json=payload)
            
            if response.status_code in [200, 201]:
                print(f"✅ Berhasil [{i+1}]: Produk {payload['product_id']} | Tanggal: {random_date}")
            else:
                print(f"❌ Gagal [{i+1}]: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"🔥 Error: {e}")

if __name__ == "__main__":
    generate_bulk_messages()