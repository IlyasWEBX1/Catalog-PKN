
import random

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db import transaction

from Catalogue.models import Produk, Pesan

User = get_user_model()


class Command(BaseCommand):
    help = "Generate pesan simulasi langsung ke database Django."

    TEMPLATES = [
        "Apakah stok masih ada?",
        "Bisa kirim pakai Grab/Gojek hari ini?",
        "Ada promo untuk pembelian grosir?",
        "Barangnya original kak?",
        "Warnanya ready apa saja ya?",
        "Bisa minta realpict-nya?",
        "Pengiriman dari mana?",
        "Ada garansi toko tidak?",
        "Kira-kira sampai berapa hari ya?",
        "Bahannya terbuat dari apa?",
    ]

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=10,
            help="Jumlah pesan yang ingin dibuat (default: 10).",
        )
        parser.add_argument(
            "--product-id",
            type=int,
            default=None,
            help="ID produk tertentu. Jika kosong, produk dipilih acak.",
        )
        parser.add_argument(
            "--username",
            type=str,
            default=None,
            help="Username pengguna yang akan dikaitkan dengan pesan.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        count = options["count"]

        if count < 1:
            raise CommandError("Jumlah pesan minimal 1.")

        if options["product_id"]:
            products = list(
                Produk.objects.filter(id=options["product_id"])
            )
            if not products:
                raise CommandError("Produk dengan ID tersebut tidak ditemukan.")
        else:
            products = list(Produk.objects.all())

        if not products:
            raise CommandError("Belum ada produk di database.")

        username = options["username"]

        if username:
            customer = User.objects.filter(username=username).first()
            if not customer:
                raise CommandError(f"User '{username}' tidak ditemukan.")
        else:
            customer = User.objects.filter(
                peran__in=["pengguna", "user"],
                is_active=True,
            ).first()

            if customer is None:
                customer = User.objects.filter(
                    username="ilyas2",
                    is_active=True,
                ).first()

        created_count = 0

        for _ in range(count):
            produk = random.choice(products)

            Pesan.objects.create(
                user=customer,
                produk=produk,
                isi_pesan=(
                    f"Halo, saya ingin memesan {produk.nama}. "
                    f"{random.choice(self.TEMPLATES)}"
                ),
            )

            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Berhasil membuat {created_count} pesan di database aktif."
            )
        )
