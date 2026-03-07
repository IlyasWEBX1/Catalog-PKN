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
from django.db import connection, transaction

# --- HELPER FUNCTIONS ---
def calculate_content_similarity_with_score(target_product, candidate_queryset, weight=0.5):
    """
    Fungsi BARU: Mengembalikan List of Tuples (Produk, Skor) 
    untuk kebutuhan tampilan API dan Data Skripsi.
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

    vectorizer = CountVectorizer().fit_transform(all_texts)
    vectors = vectorizer.toarray()
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    skor_final = []
    for i, produk in enumerate(candidate_queryset):
        score = cosine_sim[i]
        # Logika Penambahan Bobot Kategori
        if produk.kategori == target_product.kategori:
            score += weight
        skor_final.append((produk, score)) # Simpan Produk dan Skornya

    skor_final.sort(key=lambda x: x[1], reverse=True)
    return skor_final[:] # Mengembalikan semua data yang disortir

def calculate_content_similarity(target_product, candidate_queryset, weight=0.5):
    """
    Fungsi pembantu untuk menghitung skor similarity (Cosine + Category Weight).
    Digunakan oleh rekomendasi_produk dan HybridRecommendationView.
    """
    if not candidate_queryset.exists():
        return []

    # Tahap 1: CONTENT ANALYZER / FEATURE EXTRACTION
    # Mengubah data tidak terstruktur menjadi representasi profil item (Item Profile).
    def create_soup(p):
        nama = str(p.nama or "")
        deskripsi = str(p.deskripsi or "")
        merek = str(p.merek or "")
        tag = str(p.tag or "")
        return f"{nama} {deskripsi} {merek} {tag}".lower()

    # Tahap 2: REPRESENTASI VECTOR SPACE MODEL (VSM)
    target_soup = create_soup(target_product)
    candidate_soups = [create_soup(p) for p in candidate_queryset]
    all_texts = [target_soup] + candidate_soups

   # Tahap 3: TOKENIZATION & WEIGHTING (Vectorization)
    # CountVectorizer mengubah teks menjadi vektor frekuensi kata (Term Frequency).
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

    def perform_create(self, serializer):
        # 1. Simpan data kategori baru (baik dari API atau Website)
        instance = serializer.save()
        
        # 2. Reset Sequence PostgreSQL secara otomatis
        # Ini mencegah tabrakan ID (duplicate key) di masa depan
        with connection.cursor() as cursor:
            table_name = "Catalogue_kategori" # Sesuaikan jika nama app kamu bukan 'Catalogue'
            cursor.execute(f"""
                SELECT setval(
                    pg_get_serial_sequence('"{table_name}"', 'id'), 
                    coalesce(max(id), 0) + 1, 
                    false
                ) FROM "{table_name}";
            """)

class PesanViewSet(viewsets.ModelViewSet):
    queryset = Pesan.objects.all()
    serializer_class = PesanSerializer
    permission_classes = [IsAdmin] 
    def perform_create(self, serializer):
    # Ambil data waktu dari request jika ada (untuk keperluan testing/injeksi)
    # Jika tidak ada, biarkan model menggunakan default=timezone.now
        waktu_input = self.request.data.get('waktu')
        
        if waktu_input:
            instance = serializer.save(user=self.request.user, waktu=waktu_input)
        else:
            instance = serializer.save(user=self.request.user)

        # 2. Sinkronisasi Sequence ID (Tetap dipertahankan)
        with connection.cursor() as cursor:
            table_name = "Catalogue_pesan"
            cursor.execute(f"""
                SELECT setval(
                    pg_get_serial_sequence('"{table_name}"', 'id'), 
                    coalesce(max(id), 0) + 1, 
                    false
                ) FROM "{table_name}";
            """)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_message(request):
    product_id = request.data.get("product_id")
    message = request.data.get("message")
    user_id = request.data.get("user_id")
    tanggal_custom = request.data.get("tanggal") 

    if not all([product_id, message]): 
        return Response({"error": "Missing fields"}, status=400)

    try:
        # Gunakan filter().first() agar lebih aman atau sesuaikan logic user kamu
        user = User.objects.filter(id=user_id).first() if user_id else User.objects.filter(username="guest").first()
    except Exception as e:
        return Response({"error": str(e)}, status=404)

    try:
        # 1. Inisialisasi Objek
        pesan = Pesan(user=user, produk_id=product_id, isi_pesan=message)
        
        # 2. Assign Tanggal Custom jika ada
        if tanggal_custom:
            pesan.waktu_dikirim = tanggal_custom # Pastikan nama field di model Pesan benar
        
        pesan.save()

        # 3. MAGIC LOGIC: Reset Sequence PostgreSQL
        with connection.cursor() as cursor:
            table_name = "Catalogue_pesan" # Sesuaikan NamaApp_NamaModel
            cursor.execute(f"""
                SELECT setval(
                    pg_get_serial_sequence('"{table_name}"', 'id'), 
                    coalesce(max(id), 0) + 1, 
                    false
                ) FROM "{table_name}";
            """)

        return Response({
            "status": "Success",
            "message": f"Pesan created for product {product_id}",
            "timestamp": pesan.waktu_dikirim
        }, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


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
            # 1. Simpan produk baru
            serializer.save()
            
            # 2. Reset Sequence PostgreSQL secara otomatis
            # Mencegah IntegrityError (duplicate key) pada ID
            with connection.cursor() as cursor:
                table_name = "Catalogue_produk" # Pastikan nama tabel benar
                cursor.execute(f"""
                    SELECT setval(
                        pg_get_serial_sequence('"{table_name}"', 'id'), 
                        coalesce(max(id), 0) + 1, 
                        false
                    ) FROM "{table_name}";
                """)
                
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
            # 1. Catat Log Interaksi
            InteractionLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                produk=instance, 
                tipe_interaksi='view'
            )
            
            # 2. Reset Sequence InteractionLog secara otomatis
            # Ini memastikan pencatatan log berikutnya tidak pernah Error 500
            with connection.cursor() as cursor:
                table_name = "Catalogue_interactionlog" # Pastikan nama tabel benar
                cursor.execute(f"""
                    SELECT setval(
                        pg_get_serial_sequence('"{table_name}"', 'id'), 
                        coalesce(max(id), 0) + 1, 
                        false
                    ) FROM "{table_name}";
                """)
                
        except Exception as e:
            # Tetap gunakan print/logger agar kita tahu jika ada masalah lain
            print(f"Log Error: {e}")
            
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
        recommendations_with_score = calculate_content_similarity_with_score(target_product, candidates, weight=0.5)
        
        return Response({
            "target_basis": target_product.nama,
            "data": ProdukSerializer(recommendations, many=True).data,
            "data_with_scores": [
                {
                    "produk": ProdukSerializer(p).data,
                    "score": score
                } for p, score in recommendations_with_score
            ]
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
            
            # 1. Total Views (Tetap sama)
            views = InteractionLog.objects.filter(produk=produk, tipe_interaksi='view').count()
            
            # 2. Update Logika Inquiries
            # Kita hitung semua pesan yang masuk (Engagement)
            total_inquiries = Pesan.objects.filter(produk=produk).count()
            
            # Kita hitung pesan yang sampai tahap 'confirmed' (Penjualan Sukses via Pesan)
            confirmed_inquiries = Pesan.objects.filter(produk=produk, status='confirmed').count()
            
            # 3. Update Conversion Rate
            # Sekarang jauh lebih akurat: Seberapa banyak view yang jadi konfirmasi?
            conv_rate = f"{(confirmed_inquiries / views * 100):.1f}%" if views > 0 else "0%"
            
            # --- Bagian Sales & Chart tetap dipertahankan ---
            monthly_sales = TransactionDetail.objects.filter(produk=produk).annotate(
                month=TruncMonth('transaksi__tanggal')
            ).values('month').annotate(
                revenue=Sum('total_penjualan_detail'), 
                qty=Sum('jumlah_terjual')
            ).order_by('month')
            
            chart_data = [
                {
                    "month": i['month'].strftime('%b %Y'), 
                    "revenue": float(i['revenue'] or 0), 
                    "qty": i['qty'] or 0
                } for i in monthly_sales
            ]
            
            total_rev = sum(i['revenue'] for i in chart_data)
            total_qty = sum(i['qty'] for i in chart_data)

            return Response({
                "product_name": produk.nama,
                "current_stock": produk.stok,
                "total_stock_value": float(produk.harga * produk.stok),
                "sales_performance": {
                    "total_revenue": total_rev,
                    "quantity_sold": total_qty,
                    "average_price_point": float(total_rev/total_qty) if total_qty > 0 else 0
                },
                "engagement": {
                    "views": views,
                    "total_inquiries": total_inquiries, # Mengganti inquiries lama
                    "confirmed_inquiries": confirmed_inquiries, # Menambah metrik baru
                    "conversion_rate": conv_rate
                },
                "chart_data": chart_data
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)


# --- TRANSACTION & LOGGING ---

@api_view(['POST'])
def konfirmasi_pesanan(request, produk_id, pesan_id):
    try:
        pesan, produk = Pesan.objects.get(id=pesan_id), Produk.objects.get(id=produk_id)
        jumlah = int(request.data.get('jumlah', 1))
        if produk.stok < jumlah: return Response({'error': 'Stok tidak mencukupi'}, status=400)
        laporan = Laporan.objects.create(user_admin=request.user if request.user.is_authenticated else None, tanggal=pesan.waktu.date(), nama_pembeli=pesan.user.nama if pesan.user else "Guest")
        TransactionDetail.objects.create(transaksi=laporan, produk=produk, jumlah_terjual=jumlah, harga_satuan=produk.harga, total_penjualan_detail=produk.harga * jumlah)
        laporan.total_penjualan_keseluruhan = produk.harga * jumlah
        laporan.save()
        produk.stok -= jumlah
        produk.save()
        pesan.status = 'confirmed'
        pesan.save()
        print(pesan.waktu, produk.nama, jumlah, request.user.username if request.user.is_authenticated else "Guest")
        return Response({'message': 'Pesanan berhasil dikonfirmasi'}, status=201)
    except Exception as e: return Response({'error': str(e)}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def interaction_log_create(request):
    try:
        # 1. Ambil data dari request
        u_id = request.data.get('user')
        p_id = request.data.get('produk')
        tipe = request.data.get('tipe_interaksi', 'view')
        durasi = request.data.get('durasi', 0)

        # 2. Validasi minimal: Cek apakah produk ada
        if not Produk.objects.filter(id=p_id).exists():
            return Response({"error": f"Produk ID {p_id} tidak ditemukan"}, status=400)

        # 3. Simpan Log
        InteractionLog.objects.create(
            user_id=u_id, 
            produk_id=p_id,
            tipe_interaksi=tipe, 
            durasi=durasi
        )

        # 4. SELF-HEALING: Reset Sequence ID PostgreSQL
        # Ini mencegah error 'Key (id)=(X) already exists' di masa depan
        with connection.cursor() as cursor:
            table_name = "Catalogue_interactionlog" # Pastikan nama tabel benar
            cursor.execute(f"""
                SELECT setval(
                    pg_get_serial_sequence('"{table_name}"', 'id'), 
                    coalesce(max(id), 0) + 1, 
                    false
                ) FROM "{table_name}";
            """)

        return Response({"status": "Created & Sequence Synchronized"}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)
# views.py
from .models import Produk # Pastikan diimport

@api_view(['POST'])
@permission_classes([AllowAny])
def inject_laporan(request):
    try:
        data = request.data
        p_id = data.get("product_id")
        
        # 1. Validasi Produk
        if not Produk.objects.filter(id=p_id).exists():
            return Response({"error": f"Produk ID {p_id} tidak ditemukan!"}, status=400)

        # Gunakan transaction.atomic agar jika satu gagal, semua dibatalkan (Data Integrity)
        with transaction.atomic():
            # 2. Buat Header Laporan
            laporan = Laporan.objects.create(
                user_admin_id=data.get("user_admin_id"),
                tanggal=data.get("tanggal"),
                nama_pembeli=data.get("nama_pembeli", "Dummy Buyer"),
                total_penjualan_keseluruhan=data.get("total_revenue", 0)
            )
            
            # 3. Buat Detail Transaksi (Ini yang dibaca oleh Dashboard Performance)
            TransactionDetail.objects.create(
                transaksi=laporan,
                produk_id=p_id,
                jumlah_terjual=data.get("qty", 1),
                harga_satuan=data.get("harga_satuan", 0),
                total_penjualan_detail=data.get("total_revenue", 0)
            )

            # 4. SELF-HEALING: Reset Sequence PostgreSQL
            # Melindungi tabel Laporan dan TransactionDetail dari IntegrityError
            with connection.cursor() as cursor:
                for table in ["Catalogue_laporan", "Catalogue_transactiondetail"]:
                    cursor.execute(f"""
                        SELECT setval(
                            pg_get_serial_sequence('"{table}"', 'id'), 
                            coalesce(max(id), 0) + 1, 
                            false
                        ) FROM "{table}";
                    """)
        
        return Response({"message": f"Injeksi Berhasil ID {laporan.id} & Database Sinkron"}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)