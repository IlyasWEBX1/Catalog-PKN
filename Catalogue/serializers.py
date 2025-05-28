from rest_framework import serializers
from .models import Produk, Kategori, Pesan, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class ProdukSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produk
        fields = '__all__'
        extra_kwargs = {
            'gambar': {'required': False, 'allow_null': True},
        }
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

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['peran'] = user.peran  # Add role to token
        return token

