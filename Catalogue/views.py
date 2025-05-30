from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from datetime import date
from rest_framework import status, generics, viewsets
from django.shortcuts import render
from .models import Produk, Kategori, Pesan, User, Laporan
from .serializers import ProdukSerializer, KategoriSerializer, UserSerializer, PesanSerializer, MyTokenObtainPairSerializer
from .permissions import IsAdmin
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [IsAdmin]

class PesanViewSet(viewsets.ModelViewSet):
    queryset = Pesan.objects.all()
    serializer_class = PesanSerializer
    permission_classes = [IsAdmin] 
    
    def perform_create(self, serializer):
        # Automatically set the `user` field to the currently logged-in user
        serializer.save(user=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class ProdukDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Produk.objects.all()
    serializer_class = ProdukSerializer
    permission_classes = [IsAdmin]

class ProdukList(APIView):
    permission_classes = [IsAdmin]  # admin only
    
    def get(self, request):
        produk = Produk.objects.all()
        serializer = ProdukSerializer(produk, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProdukSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def send_message(request):
    product_id = request.data.get("product_id")
    message = request.data.get("message")
    user_id = request.data.get("user_id")

    if not all([product_id, message]):
        return Response({"error": "Missing fields"}, status=400)

    try:
        user = User.objects.get(id=user_id) if user_id else User.objects.get(username="guest")
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Always create a new laporan (new ID every time)
    laporan = Laporan.objects.create(
        user=user,
        tanggal=date.today(),
        total_produk=1
    )

    # Save message
    Pesan.objects.create(
        user=user,
        produk_id=product_id,
        laporan=laporan,
        isi_pesan=message
    )

    return Response({"message": "Pesan created", "laporan_id": laporan.id})

@api_view(['POST'])
def kurangi_stok(request, pk, pesan_id):
    try:
        pesan = Pesan.objects.get(id=pesan_id)
        produk = Produk.objects.get(pk=pk)
        if produk.stok > 0:
            produk.stok -= 1
            produk.save()
            pesan.delete()
            return Response({'message': 'Stok dikurangi'}, status=status.HTTP_200_OK)
        return Response({'message': 'Stok sudah habis'}, status=status.HTTP_400_BAD_REQUEST)
    except Produk.DoesNotExist:
        return Response({'message': 'Produk tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)
    except Pesan.DoesNotExist:
        return Response({'message': 'Pesan tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)