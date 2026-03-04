from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db.models import Count
from Catalogue.models import Produk, InteractionLog
from Catalogue.views import calculate_content_similarity

User = get_user_model()

class Command(BaseCommand):
    help = "Evaluate recommendation system using confusion matrix"

    def handle(self, *args, **kwargs):

        TP = FP = TN = FN = 0

        users = User.objects.all()

        for user in users:

            # Ambil produk yang pernah dilihat user
            viewed_products = InteractionLog.objects.filter(
                user=user,
                tipe_interaksi='view'
            ).values_list('produk_id', flat=True)

            if not viewed_products:
                continue

            # Gunakan produk terakhir sebagai target
            target_id = viewed_products.last()

            try:
                target_product = Produk.objects.get(id=target_id)
            except Produk.DoesNotExist:
                continue

            candidates = Produk.objects.exclude(id=target_product.id)

            recommended_products = calculate_content_similarity(
                target_product,
                candidates,
                weight=0.5
            )

            recommended_ids = [p.id for p in recommended_products]

            all_product_ids = set(Produk.objects.values_list('id', flat=True))
            viewed_set = set(viewed_products)

            for pid in all_product_ids:

                predicted_positive = pid in recommended_ids
                actual_positive = pid in viewed_set

                if predicted_positive and actual_positive:
                    TP += 1
                elif predicted_positive and not actual_positive:
                    FP += 1
                elif not predicted_positive and actual_positive:
                    FN += 1
                else:
                    TN += 1

        total = TP + TN + FP + FN

        accuracy = (TP + TN) / total if total > 0 else 0
        precision = TP / (TP + FP) if (TP + FP) > 0 else 0
        recall = TP / (TP + FN) if (TP + FN) > 0 else 0

        self.stdout.write(self.style.SUCCESS("=== HASIL EVALUASI ==="))
        self.stdout.write(f"TP: {TP}")
        self.stdout.write(f"FP: {FP}")
        self.stdout.write(f"FN: {FN}")
        self.stdout.write(f"TN: {TN}")
        self.stdout.write("-----------------------")
        self.stdout.write(f"Accuracy : {accuracy:.4f}")
        self.stdout.write(f"Precision: {precision:.4f}")
        self.stdout.write(f"Recall   : {recall:.4f}")