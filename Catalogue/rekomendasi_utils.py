from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Produk
import numpy as np
import math

def build_feature_text(produk):
    # gabungkan nama + kategori + deskripsi
    return f"{produk.nama} {produk.kategori.nama} {produk.deskripsi}"


def text_to_vector(text):
    words = text.lower().split()
    vector = {}
    for w in words:
        vector[w] = vector.get(w, 0) + 1
    return vector


def cosine_similarity(v1, v2):
    dot = sum(v1.get(k, 0) * v2.get(k, 0) for k in v1.keys())
    mag1 = math.sqrt(sum(val*val for val in v1.values()))
    mag2 = math.sqrt(sum(val*val for val in v2.values()))

    if mag1 == 0 or mag2 == 0:
        return 0
    return dot / (mag1 * mag2)

def generate_recommendations(target_id, top_n=5):
    products = Produk.objects.all()
    if len(products) < 2:
        return []

    # membuat list teks fitur
    feature_texts = [build_feature_text(p) for p in products]

    # membuat TF-IDF matrix
    vectorizer = TfidfVectorizer(stop_words='indonesian')
    tfidf_matrix = vectorizer.fit_transform(feature_texts)

    # cari index produk target
    target_index = list(products).index(
        Produk.objects.get(pk=target_id)
    )

    # hitung cosine similarity
    similarity_scores = cosine_similarity(tfidf_matrix[target_index], tfidf_matrix).flatten()

    # urutkan skor dari besar ke kecil
    indices = similarity_scores.argsort()[::-1]

    recommendations = []
    for i in indices:
        if i == target_index:
            continue  # skip dirinya sendiri

        skor = float(similarity_scores[i])

        recommendations.append({
            "produk": products[i],
            "skor": skor
        })

        if len(recommendations) == top_n:
            break

    return recommendations
