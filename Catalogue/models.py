from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class Kategori(models.Model):
    nama = models.CharField(max_length=100)

class Produk(models.Model):
    kategori = models.ForeignKey(Kategori, on_delete=models.CASCADE)
    nama = models.CharField(max_length=100)
    deskripsi = models.TextField()
    harga = models.DecimalField(max_digits=10, decimal_places=2)
    gambar = models.ImageField(upload_to='produk/', blank=True, null=True)
    stok = models.IntegerField()

class Laporan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tanggal = models.DateField()
    total_produk = models.IntegerField()


class Pesan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    produk = models.ForeignKey(Produk, on_delete=models.CASCADE)
    laporan = models.ForeignKey(Laporan, on_delete=models.CASCADE)
    waktu = models.DateTimeField(auto_now_add=True)
    isi_pesan = models.TextField()

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )

    nama = models.CharField(max_length=100)
    no_whatsapp = models.CharField(max_length=20)
    peran = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    REQUIRED_FIELDS = ['email', 'nama', 'peran']  # Add this line

    def __str__(self):
        return self.username