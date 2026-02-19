from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from django.db.models.functions import TruncMonth
from datetime import date
from rest_framework import status, generics, viewsets
from django.shortcuts import render
from .models import Produk, Kategori, Pesan, User, Laporan, TransactionDetail, InteractionLog
from .serializers import (
    ProdukSerializer, KategoriSerializer, RegisterSerializer, 
    UserSerializer, PesanSerializer, MyTokenObtainPairSerializer, 
    ProdukStudioSerializer
)
from .permissions import IsAdmin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .rekomendasi_utils import text_to_vector, cosine_similarity as manual_cosine_similarity
from django.db.models import Sum, Count
from rest_framework_simplejwt.authentication import JWTAuthentication
import numpy as np

# --- HELPER FUNCTIONS ---

def calculate_content_similarity(target_product, candidate_queryset, weight=0.5):
    """
    Fungsi pembantu untuk menghitung skor similarity (Cosine + Category Weight).
    Digunakan oleh rekomendasi_produk dan HybridRecommendationView.
    """
    if not candidate_queryset.exists():
        return []

    def create_soup(p):
        nama = str(p.nama or "")
        deskripsi = str(p.deskripsi or "")
        merek = str(p.merek or "")
        tag = str(p.tag or "")
        return f"{nama} {deskripsi} {merek} {tag}".lower()

    target_soup = create_soup(target_product)
    candidate_soups = [create_soup(p) for p in candidate_queryset]
    all_texts = [target_soup] + candidate_soups

    # Hitung Cosine Similarity
    vectorizer = CountVectorizer().fit_transform(all_texts)
    vectors = vectorizer.toarray()
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    skor_final = []
    for i, produk in enumerate(candidate_queryset):
        score = cosine_sim[i]
        # Penambahan Bobot Kategori (Bi) sesuai skripsi
        if produk.kategori == target_product.kategori:
            score += weight
        skor_final.append((score, produk))

    skor_final.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in skor_final[:3]]


# --- AUTH & USER VIEWS ---

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User berhasil dibuat!", "user": serializer.data['username']}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


# --- CATEGORY & MESSAGE VIEWS ---

class KategoriViewSet(viewsets.ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer
    permission_classes = [IsAdmin]

class PesanViewSet(viewsets.ModelViewSet):
    queryset = Pesan.objects.all()
    serializer_class = PesanSerializer
    permission_classes = [IsAdmin] 
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_message(request):
    product_id = request.data.get("product_id")
    message = request.data.get("message")
    user_id = request.data.get("user_id")
    if not all([product_id, message]): return Response({"error": "Missing fields"}, status=400)
    try:
        user = User.objects.get(id=user_id) if user_id else User.objects.get(username="guest")
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    Pesan.objects.create(user=user, produk_id=product_id, isi_pesan=message)
    return Response({"message": "Pesan created"})


# --- PRODUCT CORE VIEWS ---

class ProdukList(APIView):
    permission_classes = [IsAdmin]
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

class ProdukDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Produk.objects.all()
    serializer_class = ProdukSerializer
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        try:
            InteractionLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                produk=instance, tipe_interaksi='view'
            )
        except Exception as e:
            print(f"Log Error (Ignored): {e}")
        return Response(serializer.data)


# --- RECOMMENDATION LOGIC ---

@api_view(['GET'])
def rekomendasi_produk(request, pk):
    """Rekomendasi serupa di halaman detail produk."""
    try:
        produk_target = Produk.objects.get(pk=pk)
        candidates = Produk.objects.exclude(pk=pk)
        rekomendasi = calculate_content_similarity(produk_target, candidates, weight=0.5)
        return Response(ProdukSerializer(rekomendasi, many=True).data)
    except Exception as e:
        print(f"DEBUG REKOMENDASI ERROR: {str(e)}")
        return Response({"error": "Kesalahan mesin rekomendasi"}, status=500)

class HybridRecommendationView(APIView):
    """Rekomendasi berdasarkan perilaku user + content similarity."""
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        user = request.user 
        target_product = None
        if user.is_authenticated:
            last_log = InteractionLog.objects.filter(user=user, tipe_interaksi='view')\
                                     .order_by('-durasi', '-waktu_interaksi').first()
            if last_log: target_product = last_log.produk
        
        if not target_product:
            popular_log = InteractionLog.objects.filter(tipe_interaksi='view')\
                                        .values('produk').annotate(total=Count('id'))\
                                        .order_by('-total').first()
            if popular_log: target_product = Produk.objects.get(id=popular_log['produk'])
            else: target_product = Produk.objects.order_by('-rating').first()

        if not target_product: return Response([])

        candidates = Produk.objects.exclude(id=target_product.id)
        recommendations = calculate_content_similarity(target_product, candidates, weight=0.5)
        
        return Response({
            "target_basis": target_product.nama,
            "data": ProdukSerializer(recommendations, many=True).data
        })


# --- ANALYTICS & REPORTS ---

@api_view(['GET'])
def most_bought_products(request):
    limit = int(request.GET.get('limit', 10))
    data = TransactionDetail.objects.values('produk').annotate(total_terjual=Sum('jumlah_terjual')).order_by('-total_terjual')[:limit]
    produk_ids = [item['produk'] for item in data]
    products = {p.id: p for p in Produk.objects.filter(id__in=produk_ids)}
    ordered_products = [products[p_id] for p_id in produk_ids if p_id in products]
    return Response(ProdukSerializer(ordered_products, many=True).data)

class ProdukStudioViewSet(viewsets.ModelViewSet):
    queryset = Produk.objects.all()
    serializer_class = ProdukStudioSerializer
    permission_classes = [IsAdmin]

    @action(detail=False, methods=['get'], url_path='recommendations', permission_classes=[AllowAny])
    def hybrid_recommendations(self, request):
        """Versi action dari Hybrid Recommendation (Untuk Admin/Studio)."""
        # (Logika sama dengan HybridRecommendationView, tetap dipertahankan)
        user = request.user
        most_viewed = None
        if user.is_authenticated:
            most_viewed = InteractionLog.objects.filter(user=user, tipe_interaksi='view')\
                          .values('produk').annotate(count=Count('id'))\
                          .order_by('-count').first()
        if not most_viewed:
            rekomendasi = Produk.objects.order_by('-rating')[:3]
            return Response(ProdukSerializer(rekomendasi, many=True).data)

        target_product = Produk.objects.get(id=most_viewed['produk'])
        candidates = Produk.objects.exclude(id=target_product.id)
        rekomendasi_top3 = calculate_content_similarity(target_product, candidates, weight=0.2)
        return Response(ProdukSerializer(rekomendasi_top3, many=True).data)

    @action(detail=False, methods=['get'], url_path='sales-report')
    def sales_report(self, request):
        report = TransactionDetail.objects.annotate(month=TruncMonth('transaksi__tanggal'))\
                 .values('month').annotate(total_revenue=Sum('total_penjualan_detail'), items_sold=Sum('jumlah_terjual'))\
                 .order_by('-month')
        return Response(report)

    @action(detail=True, methods=['get'])
    def performance(self, request, pk=None):
        try:
            produk = self.get_object()
            views = InteractionLog.objects.filter(produk=produk, tipe_interaksi='view').count()
            inquiries = Pesan.objects.filter(produk=produk).count()
            conv_rate = f"{(inquiries/views*100):.1f}%" if views > 0 else "0%"
            monthly_sales = TransactionDetail.objects.filter(produk=produk).annotate(month=TruncMonth('transaksi__tanggal'))\
                            .values('month').annotate(revenue=Sum('total_penjualan_detail'), qty=Sum('jumlah_terjual')).order_by('month')
            chart_data = [{"month": i['month'].strftime('%b %Y'), "revenue": float(i['revenue'] or 0), "qty": i['qty'] or 0} for i in monthly_sales]
            total_rev = sum(i['revenue'] for i in chart_data)
            total_qty = sum(i['qty'] for i in chart_data)
            return Response({
                "product_name": produk.nama, "current_stock": produk.stok,
                "total_stock_value": float(produk.harga * produk.stok),
                "sales_performance": {"total_revenue": total_rev, "quantity_sold": total_qty, "average_price_point": float(total_rev/total_qty) if total_qty > 0 else 0},
                "engagement": {"views": views, "inquiries": inquiries, "conversion_rate": conv_rate},
                "chart_data": chart_data
            })
        except Exception as e: return Response({"error": str(e)}, status=500)


# --- TRANSACTION & LOGGING ---

@api_view(['POST'])
def konfirmasi_pesanan(request, produk_id, pesan_id):
    try:
        pesan, produk = Pesan.objects.get(id=pesan_id), Produk.objects.get(id=produk_id)
        jumlah = int(request.data.get('jumlah', 1))
        if produk.stok < jumlah: return Response({'error': 'Stok tidak mencukupi'}, status=400)
        laporan = Laporan.objects.create(user_admin=request.user if request.user.is_authenticated else None, tanggal=date.today(), nama_pembeli=pesan.user.nama if pesan.user else "Guest")
        TransactionDetail.objects.create(transaksi=laporan, produk=produk, jumlah_terjual=jumlah, harga_satuan=produk.harga, total_penjualan_detail=produk.harga * jumlah)
        laporan.total_penjualan_keseluruhan = produk.harga * jumlah
        laporan.save()
        produk.stok -= jumlah
        produk.save()
        pesan.delete()
        return Response({'message': 'Pesanan berhasil dikonfirmasi'}, status=201)
    except Exception as e: return Response({'error': str(e)}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def interaction_log_create(request):
    try:
        InteractionLog.objects.create(
            user_id=request.data.get('user'), produk_id=request.data.get('produk'),
            tipe_interaksi=request.data.get('tipe_interaksi', 'view'), durasi=request.data.get('durasi', 0)
        )
        return Response({"status": "Created"}, status=201)
    except Exception as e: return Response({"error": str(e)}, status=400)