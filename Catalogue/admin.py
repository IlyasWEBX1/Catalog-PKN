from django.contrib import admin
from .models import InteractionLog

# Register your models here.
admin.site.register(InteractionLog)

class InteractionLogAdmin(admin.ModelAdmin):
    # Menampilkan kolom durasi dan waktu di daftar utama
    list_display = ('user', 'produk', 'tipe_interaksi', 'durasi', 'waktu_interaksi')
    # Menambahkan filter di sisi kanan
    list_filter = ('tipe_interaksi', 'waktu_interaksi')
    # Menambahkan fitur pencarian
    search_fields = ('user__username', 'produk__nama')
