from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# 1. MODEL PENGGUNA (ACTOR)
class User(AbstractUser):
    """
    Model Pengguna yang diperluas untuk mencakup peran (Admin/Pengguna)
    dan kontak WhatsApp.
    """
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('pengguna', 'Pengguna'),
    )

    nama = models.CharField(max_length=100)
    no_whatsapp = models.CharField(max_length=20, blank=True, null=True) 
    peran = models.CharField(max_length=10, choices=ROLE_CHOICES, default='pengguna')

    REQUIRED_FIELDS = ['email', 'nama', 'peran'] 

    def __str__(self):
        return self.username
    
# 2. MODEL KATEGORI
class Kategori(models.Model):
    """
    Model untuk mengelompokkan Produk. Digunakan sebagai bobot 
    tambahan dalam rumus rekomendasi (W_kategori).
    """
    nama = models.CharField(max_length=100)

    def __str__(self):
        return self.nama

# 3. MODEL PRODUK (Fokus Content-Based Filtering)
class Produk(models.Model):
    """
    Model utama produk. Atribut deskripsi, merek, dan tag 
    digunakan sebagai vektor fitur untuk Cosine Similarity.
    """
    kategori = models.ForeignKey(Kategori, on_delete=models.CASCADE)
    nama = models.CharField(max_length=100)
    deskripsi = models.TextField() 
    harga = models.DecimalField(max_digits=10, decimal_places=2) 
    gambar = models.ImageField(upload_to='produk/', blank=True, null=True)
    stok = models.IntegerField(default=0) # Tambahkan default 0 jika perlu
    merek = models.CharField(max_length=100, blank=True, null=True) 
    tag = models.CharField(max_length=255, blank=True, null=True) 
    rating = models.FloatField(default=0.0) 
    
    def __str__(self):
        return self.nama

# --- DUKUNGAN ANALITIK PENJUALAN ---

# 4A. MODEL TRANSAKSI PENJUALAN (Pengganti Laporan - Header Transaksi)
class Laporan(models.Model):
    """
    Model Header Transaksi Penjualan. Diinput oleh Admin 
    berdasarkan pesanan via WhatsApp.
    """
    user_admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='recorded_transactions')
    tanggal = models.DateField()
    nama_pembeli = models.CharField(max_length=100, blank=True, null=True)
    total_penjualan_keseluruhan = models.DecimalField(max_digits=12, decimal_places=2, default=0) # Total dari semua detail

    def __str__(self):
        return f"TRX-{self.id} pada {self.tanggal_transaksi}"

# 4B. DETAIL TRANSAKSI (Pengganti Laporan - Detail Produk yang Terjual)
class TransactionDetail(models.Model):
    """
    Model Detail Transaksi. Mencatat ID Produk dan kuantitas 
    yang terjual untuk Analisis Penjualan.
    """
    transaksi = models.ForeignKey(Laporan, on_delete=models.CASCADE, related_name='details')
    produk = models.ForeignKey(Produk, on_delete=models.CASCADE)
    jumlah_terjual = models.IntegerField()
    harga_satuan = models.DecimalField(max_digits=10, decimal_places=2)
    total_penjualan_detail = models.DecimalField(max_digits=10, decimal_places=2) # Jumlah * Harga Satuan

    def __str__(self):
        return f"{self.transaksi_id} - {self.produk.nama}"

# --- DUKUNGAN INTERAKSI PENGGUNA ---

# 5. MODEL LOG INTERAKSI (Mencatat perilaku untuk potensi rekomendasi di masa depan)
class InteractionLog(models.Model):
    """
    Mencatat interaksi pengguna (View/Klik) pada produk untuk analisis perilaku.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    produk = models.ForeignKey(Produk, on_delete=models.CASCADE)
    tipe_interaksi = models.CharField(max_length=50, choices=[('view', 'View Product Detail'), ('search', 'Search'), ('chat', 'WhatsApp Chat')])
    durasi = models.IntegerField(default=0, help_text="Lama melihat produk dalam detik")
    waktu_interaksi = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.tipe_interaksi} on {self.produk.nama}"

# 6. MODEL INQUIRY (Menggantikan Pesan - Kontak/Pertanyaan Produk)
class Pesan(models.Model):
    """
    Model untuk mencatat pertanyaan/pesan dari pengguna terkait produk.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    produk = models.ForeignKey(Produk, on_delete=models.CASCADE)
    waktu = models.DateTimeField(auto_now_add=True)
    isi_pesan = models.TextField()
    
    def __str__(self):
        return f"Inquiry for {self.produk.nama}"