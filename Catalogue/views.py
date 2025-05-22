from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from django.shortcuts import render
from .models import Produk, Kategori, Pesan, User
from .serializers import ProdukSerializer, KategoriSerializer, UserSerializer, PesanSerializer
from rest_framework.permissions import IsAuthenticated

class ProdukViewSet(viewsets.ModelViewSet):
    queryset = Produk.objects.all()
    serializer_class = ProdukSerializer

class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer

class PesanViewSet(viewsets.ModelViewSet):
    queryset = Pesan.objects.all()
    serializer_class = PesanSerializer
    permission_classes = [IsAuthenticated] 
    
    def perform_create(self, serializer):
        # Automatically set the `user` field to the currently logged-in user
        serializer.save(user=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProdukDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Produk.objects.all()
    serializer_class = ProdukSerializer

class ProdukList(APIView):
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