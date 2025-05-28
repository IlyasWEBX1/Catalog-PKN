from rest_framework import routers
from .views import KategoriViewSet, ProdukDetail, UserViewSet, PesanViewSet, UserDetail
from django.urls import path, include
from .views import ProdukList, send_message



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
]
