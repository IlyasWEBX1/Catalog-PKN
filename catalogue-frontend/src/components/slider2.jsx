import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import formatRupiah from "../utils/SalesFormatter";

function ItemCarousel2({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <i className="fas fa-box-open text-5xl mb-4"></i>
        <p className="text-lg font-medium text-center px-4">
          No items available at the moment
        </p>
      </div>
    );
  }

  return (
    // Outer container ensures the entire carousel is centered on the page
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative group py-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        // Centering Logic
        slidesPerView={1}
        spaceBetween={30}
        centeredSlides={false} // Set to true if you want the middle slide to always be active
        loop={items.length > 3} // Only loop if there are enough items
        breakpoints={{
          640: {
            slidesPerView: 2,
            centeredSlides: false,
          },
          1024: {
            slidesPerView: 3,
            centeredSlides: false,
          },
        }}
        className="pb-16 !px-2"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="flex justify-center">
            {/* The card width is controlled here for a balanced look */}
            <div className="group/card bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-200/40 transition-all duration-500 overflow-hidden flex flex-col transform hover:-translate-y-2 w-full max-w-[380px]">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={`http://127.0.0.1:8000${item.gambar_produk}`}
                  alt={item.nama}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white text-xs font-black uppercase tracking-widest bg-orange-600 px-4 py-1.5 rounded-full shadow-lg">
                    View Gallery
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-1 group-hover/card:text-orange-600 transition-colors">
                  {item.nama_produk}
                </h3>

                {item.harga_satuan && (
                  <p className="text-orange-600 font-black text-xl mb-5">
                    {formatRupiah(parseInt(item.harga_satuan))}
                  </p>
                )}

                <div className="mt-auto">
                  <Link
                    to={`/ProductDetail/${item.id}`}
                    className="inline-flex items-center justify-center w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-orange-600 shadow-lg shadow-slate-200 hover:shadow-orange-200 transition-all duration-300 group/btn"
                  >
                    <span>Product Detail</span>
                    <i className="fas fa-arrow-right ml-2 text-xs transition-transform group-hover/btn:translate-x-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .swiper-button-next, .swiper-button-prev {
          background: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          color: #ea580c !important;
          box-shadow: 0 10px 20px -5px rgb(0 0 0 / 0.1);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          top: 45%;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 18px !important;
          font-weight: bold;
        }
        .swiper-button-next { right: -10px; }
        .swiper-button-prev { left: -10px; }
        
        @media (max-width: 768px) {
          .swiper-button-next, .swiper-button-prev { display: none; }
        }

        .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #ea580c !important;
          width: 28px !important;
          border-radius: 5px !important;
        }
      `,
        }}
      />
    </div>
  );
}

export default ItemCarousel2;
