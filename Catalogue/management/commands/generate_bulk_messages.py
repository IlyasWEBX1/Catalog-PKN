import requests
import random
import time
from datetime import datetime, timedelta

# Gunakan session agar koneksi lebih stabil
session = requests.Session()
API_BASE = "https://django-backend-production-a01f.up.railway.app/Catalogue_api"

def inject_10_messages(target_product_id):
    # 1. Ambil info produk untuk subjek pesan agar realistis
    print(f"🔍 Mengecek produk ID {target_product_id}...")
    try:
        # Kita asumsikan endpoint ini sudah ada dari diskusi sebelumnya
        r_prod = session.get(f"{API_BASE}/produk/{target_product_id}/", timeout=10)
        product_name = r_prod.json().get('nama', 'Produk') if r_prod.status_code == 200 else "Produk"
    except:
        product_name = "Produk"

    # 2. Template pesan simulasi
    templates = [
        "Apakah stok masih ada?",
        "Bisa kirim pakai Grab/Gojek hari ini?",
        "Ada promo untuk pembelian grosir?",
        "Barangnya original kak?",
        "Warnanya ready apa saja ya?",
        "Bisa minta realpict-nya?",
        "Pengiriman dari mana?",
        "Ada garansi toko tidak?",
        "Kira-kira sampai berapa hari ya?",
        "Bahannya terbuat dari apa?"
    ]

    print(f"🚀 Memulai injeksi 10 pesan untuk: {product_name}...")

    # 3. Loop untuk 10 pesan
    for i in range(7):
        # Buat tanggal mundur (Pesan 1 hari ini, Pesan 2 kemarin, dst)
        past_date = (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%d %H:%M:%S')
        
        payload = {
            "product_id": target_product_id,
            "message": templates[i],
            "user_id": 1,         # Sesuaikan dengan ID Admin/User kamu
            "tanggal": past_date  # Dikirim ke endpoint send-message kamu
        }

        try:
            # Gunakan endpoint send-message yang baru kita bahas
            response = session.post(f"{API_BASE}/send-message/", json=payload, timeout=10)
            
            if response.status_code == 201 or response.status_code == 200:
                print(f"✅ [{i+1}/10] Berhasil: '{templates[i][:20]}...' pada {past_date}")
            else:
                print(f"❌ [{i+1}/10] Gagal: {response.status_code} - {response.text}")
            
            # Beri jeda sedikit agar server tidak kaget
            time.sleep(0.5)

        except Exception as e:
            print(f"⚠️ Error pada index {i}: {e}")

    print("\n✨ Injeksi 10 pesan selesai! Silakan cek Dashboard Performance.")

if __name__ == "__main__":
    # Ganti angka 3 dengan ID produk yang ingin kamu isi pesannya
    inject_10_messages(target_product_id=5)