from django.db.models import Sum, F
from django.db.models.functions import TruncMonth, TruncDate
from django.http import JsonResponse
from rest_framework.response import Response
from .models import Produk, TransactionDetail, Laporan
from rest_framework.decorators import api_view

from datetime import datetime

def get_date_range(request):
    start = request.GET.get("start")
    end = request.GET.get("end")

    filters = {}
    if start:
        filters["transaksi__tanggal__gte"] = start
    if end:
        filters["transaksi__tanggal__lte"] = end

    return filters


def produk_terlaris(request):
    filters = get_date_range(request)

    data = (
        TransactionDetail.objects
        .filter(**filters)
        .values(
            nama_produk=F('produk__nama'),
            gambar_produk=F('produk__gambar')
        )
        .annotate(
            total_terjual=Sum('jumlah_terjual'),
            harga_satuan=F('produk__harga'),)
        .order_by('-total_terjual')[:10]
    )

    return JsonResponse(list(data), safe=False)

def pendapatan_terbanyak(request):
    filters = get_date_range(request)

    data = (
        TransactionDetail.objects
        .filter(**filters)
        .values(
            "produk__id",
            "produk__nama",
            "produk__gambar"
        )
        .annotate(
            total_terjual=Sum("jumlah_terjual"),
            total_revenue=Sum("total_penjualan_detail"),
        )
        .order_by("-total_revenue")[:10]
    )

    return JsonResponse(list(data), safe=False)


def tren_penjualan_bulanan(request):
    data = (
        TransactionDetail.objects
        .annotate(bulan=TruncMonth('transaksi__tanggal'))
        .values('bulan')
        .annotate(total_penjualan=Sum('total_penjualan_detail'))
        .order_by('bulan')
    )
    return JsonResponse(list(data), safe=False)

def penjualan_per_kategori(request):
    data = (
        TransactionDetail.objects
        .values(kategori_terlaris=F('produk__kategori__nama'))
        .annotate(total_terjual=Sum('jumlah_terjual'))
        .order_by('-total_terjual')
    )
    return JsonResponse(list(data), safe=False)

def revenue_trend(request):
    data = (
        Laporan.objects
        .values('tanggal')
        .annotate(
            total_revenue=Sum('total_penjualan_keseluruhan')
        )
        .order_by('tanggal')
    )

    # Convert Decimal → float (WAJIB)
    result = [
        {
            "tanggal_trx": item["tanggal"],
            "total_revenue": float(item["total_revenue"] or 0)
        }
        for item in data
    ]

    return JsonResponse(result, safe=False)


def analytics_overview(request):
    filters = get_date_range(request)

    total_revenue = (
        TransactionDetail.objects
        .filter(**filters)
        .aggregate(total=Sum("total_penjualan_detail"))
        ["total"] or 0
    )

    produk_stats = (
        TransactionDetail.objects
        .filter(**filters)
        .values(nama_produk=F('produk__nama'))
        .annotate(
            total_terjual=Sum('jumlah_terjual'),
            total_revenue=Sum('total_penjualan_detail')
        )
        .order_by('-total_revenue')[:10]
    )

    return JsonResponse({
        "summary": {
            "total_revenue": float(total_revenue),
            "total_products": Produk.objects.count(),
            "total_orders": Laporan.objects.filter(
                tanggal__range=[
                    request.GET.get("start", "1900-01-01"),
                    request.GET.get("end", "2100-01-01")
                ]
            ).count(),
        },
        "produk": list(produk_stats)
    })

def analytics_product_multiline(request):
    start = request.GET.get("start")
    end = request.GET.get("end")

    filters = {}
    if start and end:
        filters["transaksi__tanggal__range"] = [start, end]

    qs = (
        TransactionDetail.objects
        .filter(**filters)
        .values(
            "transaksi__tanggal",
            "produk__nama"
        )
        .annotate(
            total_qty=Sum("jumlah_terjual"),
            total_revenue=Sum("total_penjualan_detail")
        )
        .order_by("transaksi__tanggal")
    )

    data = {}

    for row in qs:
        tanggal = str(row["transaksi__tanggal"])
        produk = row["produk__nama"] or "Unknown"

        if tanggal not in data:
            data[tanggal] = {
                "tanggal": tanggal,
                "total_revenue": 0,
                "total_qty": 0,
                "products": {}
            }

        data[tanggal]["total_revenue"] += row["total_revenue"] or 0
        data[tanggal]["total_qty"] += row["total_qty"] or 0

        data[tanggal]["products"][produk] = {
            "revenue": row["total_revenue"] or 0,
            "qty": row["total_qty"] or 0
        }

    return JsonResponse(list(data.values()), safe=False)

