from rest_framework import serializers
from .models import Produk, Kategori, Pesan, User

class ProdukSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produk
        fields = '__all__'

class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = '__all__'

class PesanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pesan
        fields = '__all__'
        read_only_fields = ('user',)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


