import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from Catalogue.models import Produk, InteractionLog

User = get_user_model()

class Command(BaseCommand):
    help = "Generate dummy users and interaction logs"

    def handle(self, *args, **kwargs):

        products = list(Produk.objects.all())
        if not products:
            self.stdout.write(self.style.ERROR("Produk kosong!"))
            return

        # 1️⃣ Buat 40 user dummy
        users = []
        for i in range(40):
            user, created = User.objects.get_or_create(
                username=f"user_dummy_{i}",
                defaults={
                    "email": f"user{i}@test.com",
                    "password": "password123"
                }
            )
            users.append(user)

        self.stdout.write(self.style.SUCCESS("Users created."))

        # 2️⃣ Generate interaction log
        for user in users:

            # Pilih 1 kategori favorit
            fav_produk = random.choice(products)
            fav_kategori = fav_produk.kategori

            for _ in range(random.randint(10, 20)):

                if random.random() < 0.7:
                    # 70% ke kategori favorit
                    candidates = [p for p in products if p.kategori == fav_kategori]
                    if candidates:
                        produk = random.choice(candidates)
                    else:
                        produk = random.choice(products)
                else:
                    # 30% random eksplorasi
                    produk = random.choice(products)

                InteractionLog.objects.create(
                    user=user,
                    produk=produk,
                    tipe_interaksi='view',
                    durasi=random.randint(5, 60)
                )

        self.stdout.write(self.style.SUCCESS("Dummy interaction data generated successfully!"))