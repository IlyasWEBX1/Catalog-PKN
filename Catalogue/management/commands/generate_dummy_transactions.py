
import random
from decimal import Decimal
from datetime import timedelta

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone

from Catalogue.models import Produk, Laporan, TransactionDetail

User = get_user_model()


class Command(BaseCommand):
    help = "Generate dummy sales transactions and transaction details."

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=10,
            help="Jumlah transaksi dummy yang ingin tersedia.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        count = options["count"]

        if count < 1:
            raise CommandError("Jumlah transaksi minimal 1.")

        products = list(Produk.objects.all())

        if not products:
            raise CommandError("Belum ada produk di database.")

        admin = User.objects.filter(
            is_active=True,
            is_staff=True,
        ).first()

        today = timezone.localdate()
        created_count = 0
        skipped_count = 0

        for i in range(1, count + 1):
            buyer_name = f"Dummy Buyer {i:03d}"
            transaction_date = today - timedelta(days=random.randint(1, 180))

            # Identitas stabil agar tidak membuat transaksi duplikat.
            existing = Laporan.objects.filter(
                nama_pembeli=buyer_name,
            ).first()

            if existing:
                skipped_count += 1
                continue

            report = Laporan.objects.create(
                user_admin=admin,
                tanggal=transaction_date,
                nama_pembeli=buyer_name,
                total_penjualan_keseluruhan=Decimal("0.00"),
            )

            selected_products = random.sample(
                products,
                k=min(random.randint(1, 3), len(products)),
            )

            grand_total = Decimal("0.00")

            for product in selected_products:
                quantity = random.randint(1, 3)
                unit_price = product.harga

                detail_total = (
                    unit_price * quantity
                ).quantize(Decimal("0.01"))

                TransactionDetail.objects.create(
                    transaksi=report,
                    produk=product,
                    jumlah_terjual=quantity,
                    harga_satuan=unit_price,
                    total_penjualan_detail=detail_total,
                )
                self.stdout.write(
                    f"Transaksi berhasil dibuat: TRX-{report.id}"
                )
                self.stdout.write(f"Pembeli: {report.nama_pembeli}")
                self.stdout.write(f"Tanggal: {report.tanggal}")

                for detail in report.details.all():
                    self.stdout.write(
                        f"  - {detail.produk.nama} | "
                        f"Jumlah: {detail.jumlah_terjual} | "
                        f"Subtotal: Rp{detail.total_penjualan_detail}"
                    )

                self.stdout.write(
                    f"Total transaksi: Rp{report.total_penjualan_keseluruhan}"
                )
                self.stdout.write("-" * 50)

                grand_total += detail_total

            report.total_penjualan_keseluruhan = grand_total
            report.save(update_fields=["total_penjualan_keseluruhan"])

            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Berhasil membuat {created_count} transaksi dummy."
            )
        )

        self.stdout.write(
            f"Transaksi dilewati karena sudah ada: {skipped_count}"
        )
