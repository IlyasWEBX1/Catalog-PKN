from rest_framework import routers
from . import views
from .views import HybridRecommendationView, KategoriViewSet, ProdukDetail, RegisterView, UserViewSet, PesanViewSet, UserDetail, ProdukStudioViewSet
from django.urls import path, include
from .views import ProdukList, send_message, konfirmasi_pesanan, most_bought_products
from .analytics_views import (
    produk_terlaris,
    tren_penjualan_bulanan,
    penjualan_per_kategori,
    revenue_trend,
    analytics_overview,
    analytics_product_multiline,
    pendapatan_terbanyak
)



router = routers.DefaultRouter()
router.register(r'kategori', KategoriViewSet)
router.register(r'user', UserViewSet)
router.register(r'pesan', PesanViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('produk/', ProdukList.as_view(), name='product-list'),
    path('produk/<int:pk>/', ProdukDetail.as_view(), name='product-detail'),
    path('user/<int:pk>/', UserDetail.as_view(), name='product-detail'),
    path('send-message/', send_message, name='send_message'),
    path('konfirmasi-pesanan/<int:produk_id>/<int:pesan_id>', konfirmasi_pesanan),
    path('recommendations/<int:pk>/', views.rekomendasi_produk, name='recommendations'),
    path('analytics/produk-terlaris/', produk_terlaris),
    path('analytics/tren-bulanan/', tren_penjualan_bulanan),
    path('analytics/kategori/', penjualan_per_kategori),
    path('analytics/revenue-trend/', revenue_trend),
    path('analytics/pendapatan-terbanyak/', pendapatan_terbanyak),
    path('analytics/overview/', analytics_overview),
    path('analytics/product-multiline/', analytics_product_multiline),
    path('produk/configuration/', ProdukStudioViewSet.as_view({'get': 'list'}), name='produk-configuration-list'),
    
    # 2. THIS IS THE MISSING LINK: This handles specific IDs (Detail, Update, Delete)
    path('produk/configuration/<int:pk>/', ProdukStudioViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='produk-configuration-detail'),

    # 3. This handles your custom performance action
    path('produk/configuration/<int:pk>/performance/', ProdukStudioViewSet.as_view({
        'get': 'performance'
    }), name='produk-configuration-performance'),
    path('recommendations/hybrid/', HybridRecommendationView.as_view(), name='hybrid-recommendation'),
    path('register/', RegisterView.as_view(), name='register'),
    path('interaction-logs/', views.interaction_log_create, name='interaction-log-create'),
]
