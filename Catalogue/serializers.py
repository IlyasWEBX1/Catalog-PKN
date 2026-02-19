from rest_framework import serializers
from .models import Produk, Kategori, Pesan, User, TransactionDetail, InteractionLog
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Sum

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

class ProdukStudioSerializer(serializers.ModelSerializer):
    # Custom fields for the analytics section of your UI
    total_value = serializers.SerializerMethodField()
    total_sold = serializers.SerializerMethodField()
    total_views = serializers.SerializerMethodField()

    class Meta:
        model = Produk
        fields = [
            'id', 'kategori', 'nama', 'deskripsi', 'harga', 
            'gambar', 'stok', 'merek', 'tag', 'rating',
            'total_value', 'total_sold', 'total_views'
        ]

    def get_total_value(self, obj):
        # Calculation: Price * Stock
        return obj.harga * obj.stok

    def get_total_sold(self, obj):
        # Aggregates units sold from TransactionDetail model
        result = TransactionDetail.objects.filter(produk=obj).aggregate(Sum('jumlah_terjual'))
        return result['jumlah_terjual__sum'] or 0

    def get_total_views(self, obj):
        # Counts 'view' interactions from InteractionLog
        return InteractionLog.objects.filter(produk=obj, tipe_interaksi='view').count()

class RegisterSerializer(serializers.ModelSerializer):
    # Field tambahan untuk konfirmasi password
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'nama', 'no_whatsapp', 'peran', 'password', 'password_confirm']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'nama': {'required': True}
        }

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Password tidak cocok."})
        return data

    def create(self, validated_data):
        # Hapus password_confirm sebelum simpan
        validated_data.pop('password_confirm')
        
        # Gunakan create_user agar password otomatis di-hash
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nama=validated_data['nama'],
            no_whatsapp=validated_data.get('no_whatsapp', ''),
            peran=validated_data.get('peran', 'pengguna')
        )
        return user