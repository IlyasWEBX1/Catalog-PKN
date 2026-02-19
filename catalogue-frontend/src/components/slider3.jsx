import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { FiArrowRight, FiInfo } from "react-icons/fi"; // Menggunakan react-icons agar konsisten

function HybridCarousel({ items, basis }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <FiInfo size={40} />
        </div>
        <p className="text-lg font-medium text-center px-4">
          Belum ada rekomendasi untuk Anda saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative group py-5">
      {/* Badge Informasi Basis Rekomendasi (Penting untuk Skripsi) */}
      {basis && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-2 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <p className="text-xs font-bold text-orange-800 uppercase tracking-tighter">
              Berdasarkan minat Anda pada:{" "}
              <span className="underline">{basis}</span>
            </p>
          </div>
        </div>
      )}

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        slidesPerView={1}
        spaceBetween={30}
        loop={items.length > 2}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-16 !px-2"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="flex justify-center">
            <div className="group/card bg-white rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:shadow-orange-200/40 transition-all duration-500 overflow-hidden flex flex-col transform hover:-translate-y-2 w-full max-w-[380px]">
              {/* Image Container */}
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden bg-slate-100 flex items-center justify-center">
                {item.gambar ? (
                  <img
                    src={
                      item.gambar.startsWith("http")
                        ? item.gambar
                        : `http://127.0.0.1:8000${item.gambar}`
                    }
                    alt={item.nama}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                ) : (
                  // Tampilan Placeholder jika gambar NULL
                  <div className="flex flex-col items-center text-slate-400">
                    <FiInfo size={40} className="mb-2 opacity-20" />
                    <span className="text-xs font-medium">
                      No Image Available
                    </span>
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm">
                  <p className="text-[10px] font-black text-slate-800 uppercase">
                    AI Recommended
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover/card:text-orange-600 transition-colors">
                  {item.nama}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {item.deskripsi}
                </p>

                <div className="mb-6">
                  <span className="text-2xl font-black text-slate-900">
                    Rp {parseInt(item.harga).toLocaleString("id-ID")}
                  </span>
                </div>

                <Link
                  to={`/ProductDetail/${item.id}`}
                  className="mt-auto inline-flex items-center justify-center w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-orange-600 transition-all duration-300 group/btn"
                >
                  <span>Lihat Detail</span>
                  <FiArrowRight className="ml-2 transition-transform group-hover/btn:translate-x-2" />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom CSS for Navigation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .swiper-button-next, .swiper-button-prev {
          background: white; width: 55px; height: 55px; border-radius: 50%;
          color: #ea580c !important; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          border: 1px solid #f1f5f9; transition: all 0.3s ease; top: 50%;
        }
        .swiper-button-next:after, .swiper-button-prev:after { font-size: 20px !important; font-weight: 800; }
        .swiper-button-next:hover, .swiper-button-prev:hover { background: #ea580c; color: white !important; }
        .swiper-button-next { right: -15px; }
        .swiper-button-prev { left: -15px; }
        .swiper-pagination-bullet-active { background: #ea580c !important; width: 30px !important; border-radius: 5px !important; }
      `,
        }}
      />
    </div>
  );
}

export default HybridCarousel;
