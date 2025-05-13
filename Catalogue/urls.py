from rest_framework import routers
from .views import ProdukViewSet, KategoriViewSet, ProdukDetail, UserViewSet, PesanViewSet
from django.urls import path, include
from .views import ProdukList

router = routers.DefaultRouter()
router.register(r'produk', ProdukViewSet)
router.register(r'kategori', KategoriViewSet)
router.register(r'user', UserViewSet)
router.register(r'pesan', PesanViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('produk/', ProdukList.as_view(), name='product-list'),
    path('produk/<int:pk>/', ProdukDetail.as_view(), name='product-detail'),
]
