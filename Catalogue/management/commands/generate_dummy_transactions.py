import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from Catalogue.models import Produk, Pesan

User = get_user_model()

class Command(BaseCommand):
    help = "Generate dummy Pesan (Inquiry) agar bisa dikonfirmasi di Dashboard Admin"

    def handle(self, *args, **kwargs):
        # 1. Cari user pengguna (untuk simulasi pembeli)
        # Jika tidak ada, pakai user 'ilyas2' atau buat guest
        customer = User.objects.filter(peran='pengguna').first() or User.objects.filter(username='ilyas2').first()
        
        products = list(Produk.objects.all())
        if not products:
            self.stdout.write(self.style.ERROR("Data Produk kosong! Isi produk dulu."))
            return

        self.stdout.write(f"Membuat pesan untuk user: {customer.username}")

        for i in range(10): # Buat 10 pesan simulasi
            produk = random.choice(products)
            Pesan.objects.create(
                user=customer,
                produk=produk,
                isi_pesan=f"Halo, saya ingin memesan {produk.nama}. Apakah stok tersedia?"
            )

        self.stdout.write(self.style.SUCCESS(f"Berhasil membuat 10 antrean pesan. Silakan cek menu Pesan/Inquiry di Dashboard Admin."))