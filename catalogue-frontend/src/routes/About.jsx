import React from "react";
import { Link } from "react-router-dom";
import image from "../assets/images/BANNER.jpg";

function About() {
  return (
    <div className="bg-white overflow-x-hidden">
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section
          className="relative h-[60vh] flex items-center justify-center bg-fixed bg-cover bg-no-repeat"
          style={{
            // Updated background image to the new profile-sized version
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})`,
            // Changed position to 'bottom' or 'top' depending on which part of the new image you want focused
            backgroundPosition: "center 20%",
          }}
        >
          <div className="w-full max-w-6xl mx-auto text-white text-center px-4 animate-in fade-in zoom-in duration-700">
            <h1 className="font-extrabold text-5xl md:text-7xl mb-4 tracking-tight drop-shadow-lg">
              About CV. Cipta Karya Abadi
            </h1>
            <div className="h-1.5 w-32 bg-orange-600 mx-auto mb-6 shadow-md"></div>
            <p className="font-semibold text-xl md:text-3xl text-orange-200 drop-shadow-md">
              Your Trusted Partner Since 1990
            </p>
          </div>
        </section>

        {/* Company Profile Section */}
        <section id="company-profile" className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Image with Decorative Border */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-4 bg-orange-100 rounded-2xl -z-10 group-hover:bg-orange-200 transition-colors duration-500"></div>
                <img
                  src={image}
                  alt="Business Partners"
                  className="rounded-xl shadow-2xl w-full object-cover transform transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Company Profile
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  CV. Cipta Karya Abadi (CKA) is a premier trading powerhouse
                  established in Surabaya. For over three decades, we have been
                  committed to elevating household standards through quality
                  products and unmatched distribution reliability.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      icon: "fa-calendar-alt",
                      title: "Established",
                      text: "Dec 10, 1990",
                    },
                    {
                      icon: "fa-store",
                      title: "Business Type",
                      text: "Houseware Experts",
                    },
                    {
                      icon: "fa-building",
                      title: "Legal Form",
                      text: "CV (Trading Business)",
                    },
                    {
                      icon: "fa-map-marker-alt",
                      title: "Main Location",
                      text: "Surabaya, Indonesia",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="bg-orange-100 p-3 rounded-lg text-orange-700">
                        <i className={`fas ${item.icon} text-xl`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-gray-500">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="py-24 bg-gray-50 overflow-hidden" id="timeline">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Our Milestone Journey
            </h2>

            <div className="relative">
              {/* Central Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>

              <div className="space-y-12">
                {[
                  {
                    year: "1990",
                    desc: "Founded in Surabaya by Drs. Mugiyanto with a vision for quality housewares.",
                    side: "left",
                  },
                  {
                    year: "2001",
                    desc: "Product expansion into electronics, building materials, and textiles.",
                    side: "right",
                  },
                  {
                    year: "2005",
                    desc: "Major expansion opening branches in Cilacap, Kebumen, and Solo.",
                    side: "left",
                  },
                  {
                    year: "2015",
                    desc: "Modernization of distribution systems and digital catalogue launch.",
                    side: "right",
                  },
                  {
                    year: "Present",
                    desc: "Innovating with sustainable practices and nationwide coverage.",
                    side: "left",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`relative flex flex-col md:flex-row items-center ${item.side === "left" ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className="hidden md:block w-1/2"></div>

                    {/* Circle Indicator */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-600 border-4 border-white rounded-full shadow-lg z-10 hidden md:block"></div>

                    {/* Content Card */}
                    <div className="w-full md:w-1/2 px-8">
                      <div
                        className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-600 hover:shadow-md transition-shadow ${item.side === "left" ? "md:text-right md:border-l-0 md:border-r-4" : ""}`}
                      >
                        <span className="text-orange-600 font-black text-2xl">
                          {item.year}
                        </span>
                        <p className="mt-2 text-gray-600 font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values & Guidelines */}
        <section className="py-24 bg-white" id="value">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pedoman Perusahaan
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Our culture is built on the foundation of Indonesian values and
                professional integrity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "fa-flag",
                  title: "Pancasila Spirit",
                  text: "Promoting unity, humanity, and social justice in every deal.",
                },
                {
                  icon: "fa-pray",
                  title: "Faith in God",
                  text: "Respecting spiritual values across all business practices.",
                },
                {
                  icon: "fa-handshake",
                  title: "Professionalism",
                  text: "Highest standards of honesty, integrity, and responsibility.",
                },
                {
                  icon: "fa-users",
                  title: "Family Spirit",
                  text: "Achieving common goals through mutual support and togetherness.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-orange-100 text-orange-700 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-700 group-hover:text-white transition-colors">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-20 bg-gray-900 text-white" id="areas">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-12">Service Network</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                "Surabaya (HQ)",
                "Cilacap",
                "Kebumen",
                "Pekalongan",
                "Solo",
              ].map((place, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-orange-600 hover:border-orange-600 transition-all cursor-default"
                >
                  <i className="fas fa-map-marker-alt text-orange-500 group-hover:text-white transition-colors"></i>
                  <span className="font-bold tracking-wide">{place}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-orange-50 text-center px-4">
          <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl shadow-orange-900/5">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              Ready to collaborate?
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Have questions or want to learn more about our distribution
              network? Our team is ready to assist you.
            </p>
            <Link
              to="/Contact"
              className="inline-block bg-orange-700 hover:bg-orange-800 text-white font-bold px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-700/20"
            >
              Contact Us Today
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
