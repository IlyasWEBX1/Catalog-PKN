from django.db import models

class Kategori(models.Model):
    nama = models.CharField(max_length=100)

class Produk(models.Model):
    kategori = models.ForeignKey(Kategori, on_delete=models.CASCADE)
    nama = models.CharField(max_length=100)
    deskripsi = models.TextField()
    harga = models.DecimalField(max_digits=10, decimal_places=2)
    gambar = models.ImageField(upload_to='produk/')
    stok = models.IntegerField()

class User(models.Model):
    nama = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    peran = models.CharField(max_length=50)
    no_whatsapp = models.CharField(max_length=20)

class Laporan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tanggal = models.DateField()
    total_produk = models.IntegerField()

class Pesan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    produk = models.ForeignKey(Produk, on_delete=models.CASCADE)
    laporan = models.ForeignKey(Laporan, on_delete=models.CASCADE)
    waktu = models.DateTimeField(auto_now_add=True)
    isi_pesan = models.TextField()
