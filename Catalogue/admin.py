from django.contrib import admin
from .models import InteractionLog, Produk, Kategori, Pesan, User, TransactionDetail, Laporan
from .serializers import ProdukSerializer

# Register your models here.
admin.site.register(InteractionLog)
admin.site.register(Produk)
admin.site.register(Kategori)
admin.site.register(Pesan)
admin.site.register(User)
admin.site.register(TransactionDetail)
admin.site.register(Laporan)

class InteractionLogAdmin(admin.ModelAdmin):
    # Menampilkan kolom durasi dan waktu di daftar utama
    list_display = ('user', 'produk', 'tipe_interaksi', 'durasi', 'waktu_interaksi')
    # Menambahkan filter di sisi kanan
    list_filter = ('tipe_interaksi', 'waktu_interaksi')
    # Menambahkan fitur pencarian
    search_fields = ('user__username', 'produk__nama')
