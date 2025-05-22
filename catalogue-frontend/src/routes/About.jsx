import logo from '../logo.svg';
import '../App.css';
import React, { useEffect, useState } from 'react';
import LOGO from '../assets/images/LOGO.png';
import { Link } from 'react-router-dom';

function About() {
  return(
  <div className="About">
  <div className="flex flex-col min-h-screen">
    {/* Hero Section */}
    <section
      className="bg-cover bg-center bg-gray-700 py-16 font-sans mt-[2%]"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),url('https://cdn.pixabay.com/photo/2018/01/20/07/19/tallest-3093955_1280.jpg')`,
      }}
    >
      <div className="w-full max-w-6xl mx-auto text-white text-center">
        <h1 className="font-bold text-4xl">About CV. Cipta Karya Abadi</h1>
        <p className="font-semibold text-2xl mt-2">Your Trusted Partner Since 1990</p>
      </div>
    </section>

    {/* Company Profile Section */}
    <section id="company-profile" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Company Profile</h2>
          <div className="w-24 h-1 bg-orange-600 mx-auto mt-2"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <img
              src="https://cdn.pixabay.com/photo/2019/11/07/08/46/handshake-4608298_1280.jpg"
              alt="Business Partners Handshake"
              className="rounded-lg shadow-md w-full"
            />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 text-gray-700">
            <p className="text-lg mb-6">
              CV. Cipta Karya Abadi (CKA) is a trading company that has been established since
              1990, committed to providing various houseware products.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
              {/* Each detail item */}
              <div className="flex items-start gap-4">
                <i className="fas fa-calendar-alt text-orange-600 text-xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-lg">Established</h4>
                  <p>December 10, 1990</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-store text-orange-600 text-xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-lg">Business Type</h4>
                  <p>Houseware products</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-building text-orange-600 text-xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-lg">Legal Form</h4>
                  <p>CV (Trading Business)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-map-marker-alt text-orange-600 text-xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-lg">Main Location</h4>
                  <p>Surabaya, Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="py-12 bg-gray-50" id="timeline">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Our History</h2>
        <div className='w-24 h-1 bg-orange-600 mx-auto mt-2 mb-12'></div>
        <div className="relative grid grid-cols-9 gap-y-10">

          {/* Vertical Line in the Middle */}
          <div className="col-span-9 absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-gray-400 z-0"></div>

          {/* === Left Item === */}
          <div className="col-span-4 flex justify-end z-10">
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md text-right">
              <h3 className="font-bold text-lg">1990</h3>
              <p>CV. Cipta Karya Abadi was founded in Surabaya by Drs. Mugiyanto with a vision to provide quality household products.</p>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center z-10">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
          </div>
          <div className="col-span-4"></div>

          {/* === Right Item === */}
          <div className="col-span-4"></div>
          <div className="col-span-1 flex items-center justify-center z-10">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
          </div>
          <div className="col-span-4 flex justify-start z-10">
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md text-left">
              <h3 className="font-bold text-lg">2001</h3>
              <p>Expanded product range to include electronics, building materials, and garments.</p>
            </div>
          </div>

          {/* === Left Item === */}
          <div className="col-span-4 flex justify-end z-10">
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md text-right">
              <h3 className="font-bold text-lg">2005–2010</h3>
              <p>Opened branches in Cilacap, Kebumen, Pekalongan, and Solo.</p>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center z-10">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
          </div>
          <div className="col-span-4"></div>

          {/* === Right Item === */}
          <div className="col-span-4"></div>
          <div className="col-span-1 flex items-center justify-center z-10">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
          </div>
          <div className="col-span-4 flex justify-start z-10">
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md text-left">
              <h3 className="font-bold text-lg">2015</h3>
              <p>Modernized our distribution system and launched our online catalogue.</p>
            </div>
          </div>

          {/* === Present Item (Left) === */}
          <div className="col-span-4 flex justify-end z-10">
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md text-right">
              <h3 className="font-bold text-lg">Present</h3>
              <p>Continuing to grow and innovate while maintaining our commitment to quality.</p>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center z-10">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
          </div>
          <div className="col-span-4"></div>

        </div>
      </div>
</section>
<section className="py-12 bg-white-50" id="structure">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Struktur Organisasi</h2>
        <div className='w-24 h-1 bg-orange-600 mx-auto mt-2 mb-12'></div>
        <div className="relative grid grid-cols-1 sm:grid-cols-5 place-items-center gap-y-4 p-4 sm:p-8">
          <div className="col-span-1 sm:col-span-5 bg-orange-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center text-white mb-6 z-10">
            <h3 className="font-bold text-lg">Drs. Mugiyono</h3>
            <p>Director</p>
          </div>
          <div className="hidden md:block absolute top-[6em] h-[80px] left-1/2 transform -translate-x-1/2 border-l-4 border-gray-400 z-0"></div>
          {/* Branch Director 1 */}
          <div className="col-span-1 bg-white-800 p-4 rounded-lg shadow-lg w-full max-w-md text-center border-2 border-orange-800 z-10">
            <h3 className="font-bold text-lg">Sukardi, SE</h3>
            <p>Branch Director - Cilacap, Solo</p>
          </div>

          {/* Spacer / border line */}
          <div className="hidden md:block col-span-1 border-2 border-gray-400 w-full z-10"></div>

          {/* Branch Director 2 */}
          <div className="col-span-1 bg-white-800 p-4 rounded-lg shadow-lg w-full max-w-md text-center border-2 border-orange-800 z-10">
            <h3 className="font-bold text-lg">Rahayu Santoso</h3>
            <p>Branch Director - Kebumen</p>
          </div>

          {/* Spacer / border line */}
          <div className="hidden md:block col-span-1 border-2 border-gray-400 w-full z-10"></div>

          {/* Branch Director 3 */}
          <div className="col-span-1 bg-white-800 border-2 border-orange-800 p-4 rounded-lg shadow-lg w-full max-w-md text-center z-10">
            <h3 className="font-bold text-lg">Hadi Wijaya</h3>
            <p>Branch Director - Pekalongan</p>
          </div>
        </div>
        <div className='flex flex-row md:flex-col text-center text-gray'>
          <div className='bg-white-800 shadow-lg rounded-lg p-24 space-y-5'>
              <p>Our organizational structure is built on a foundation of clear leadership and efficient communication. Each branch is led by an experienced director who reports directly to the main director, ensuring consistent quality and service across all locations.</p>

              <p>Every team member plays a vital role in our success, contributing their unique skills and expertise to deliver the best products and services to our customers.</p>
          </div>
        </div>
      </div>
</section>
<section className="py-12 bg-gray-50" id="mission">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Tujuan dan Komitmen Perusahaan</h2>
        <div className='w-24 h-1 bg-orange-600 mx-auto mt-2 mb-12'></div>
        <div className='flex flex-col lg:flex-row gap-10 h-full'>
           <div className="w-full lg:w-1/2 h-full mx-auto">
            <img
              src="https://cdn.pixabay.com/photo/2020/02/27/14/33/building-4884852_1280.jpg"
              alt="Business Partners Handshake"
              className="rounded-lg shadow-md w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-10 w-full lg:w-1/2 justify-center items-center">
            <div className="flex rounded-lg shadow-lg bg-white gap-3 py-10 px-8">
              <div className="lg:w-16 w-28 h-12 rounded-[100%] bg-orange-200 flex items-center justify-center text-center text-xl text-orange-700 border-4 border-white-800 shadow-lg">
                <i className="fas fa-heart"></i>
              </div>
              <div>
                <p className="font-bold mb-2">Welfare of Our Extended Family</p>
                <p>We are committed to ensuring the welfare and prosperity of all employees and their families.</p>
              </div>
            </div>
            <div className="flex rounded-lg shadow-lg bg-white gap-3 py-10 px-8">
              <div className="lg:w-16 w-28 h-12 rounded-[100%] bg-orange-200 flex items-center justify-center text-center text-xl text-orange-700 border-4 border-white-800 shadow-lg">
                <i class="fas fa-flag"></i>
              </div>
              <div>
                <p className="font-bold mb-2">Nation Building</p>
                <p>We actively participate in national development through ethical business practices and community support.</p>
              </div>
            </div>
            <div className="flex rounded-lg shadow-lg bg-white gap-3 py-10 px-8">
              <div className="lg:w-16 w-28 h-12 rounded-[100%] bg-orange-200 flex items-center justify-center text-center text-xl text-orange-700 border-4 border-white-800 shadow-lg">
                <i class="fas fa-star"></i>
              </div>
              <div>
                <p className="font-bold mb-2">Service Excellence</p>
                <p>We strive to provide the best service for our customers and the community at large.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
</section>
<section className="py-12 bg-white-50" id="value">
  <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Pedoman Perusahaan</h2>
        <div className='w-24 h-1 bg-orange-600 mx-auto mt-2 mb-12'></div>
        <div className='flex flex-row sm:flex-col gap-10 h-full'>
          <div className="flex flex-col lg:flex-row gap-10 w-full justify-center items-center">
            <div className="flex flex-col grow-0 shrink-0 basis-auto text-center transition delay-50 duration-300 ease-in-out hover:-translate-y-10 hover:scale-110 hover:shadow-lg hover: items-center w-[300px] h-96 shadow-md rounded-lg bg-white-800 gap-3 py-10 px-8">
              <div className="w-16 h-14 rounded-[100%] bg-orange-200 flex items-center justify-center text-center text-xl text-orange-700 border-4 border-white-800 shadow-lg">
                <i class="fas fa-flag"></i>
              </div>
              <div className='space-y-4'>
                <h3 className='font-bold'>Pancasila Spirit</h3>
                <p>We operate based on the five principles of Pancasila, Indonesia's national ideology, promoting unity, humanity, and social justice.</p>
              </div>
            </div>
            <div className="flex flex-col grow-0 shrink-0 basis-auto text-center transition delay-50 duration-300 ease-in-out hover:-translate-y-10 hover:scale-110 hover:shadow-lg hover: items-center w-[300px] h-96 shadow-md rounded-lg bg-white-800 gap-3 py-10 px-8">
              <div className="w-16 h-14 rounded-[100%] bg-orange-200 flex items-center justify-center text-center text-xl text-orange-700 border-4 border-white-800 shadow-lg">
                <i class="fas fa-pray"></i>
              </div>
              <div className='space-y-4'>
                <p className="font-bold mb-2">Faith in God</p>
                <p>We believe in upholding spiritual values and respecting all religious beliefs in our business practices.</p>
              </div>
            </div>
            <div className="flex flex-col grow-0 shrink-0 basis-auto text-center transition delay-50 duration-300 ease-in-out hover:-translate-y-10 hover:scale-110 hover:shadow-lg hover: items-center w-[300px] h-96 shadow-md rounded-lg bg-white-800 gap-3 py-10 px-8">
              <div className="w-16 h-14 rounded-[100%] bg-orange-200 flex items-center justify-center text-center text-xl text-orange-700 border-4 border-white-800 shadow-lg">
                <i class="fas fa-handshake"></i>
              </div>
              <div className='space-y-4'>
                <p className="font-bold mb-2">Professionalism</p>
                <p>We maintain the highest standards of honesty, integrity, and responsibility in all our business dealings.</p>
              </div>
            </div>
            <div className="flex flex-col grow-0 shrink-0 basis-auto text-center transition delay-50 duration-300 ease-in-out hover:-translate-y-10 hover:scale-110 hover:shadow-lg hover: items-center w-[300px] h-96 shadow-md rounded-lg bg-white-800 gap-3 py-10 px-8">
              <div className="w-16 h-14 rounded-[100%] bg-orange-200 flex items-center justify-center text-center text-xl text-orange-700 border-4 border-white-800 shadow-lg">
                <i class="fas fa-users"></i>
              </div>
              <div className='space-y-4'>
                <p className="font-bold mb-2">Family Spirit</p>
                <p>We foster a culture of togetherness and mutual support, working as a family to achieve common goals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
</section>
<section className="py-12 bg-gray-50" id="legal">
  <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Informasi Legalitas</h2>
        <div className='w-24 h-1 bg-orange-600 mx-auto mt-2 mb-12'></div>
        <div className='flex flex-col gap-10 h-full'>
         <div className="flex flex-col lg:flex-row gap-10 w-full justify-center items-center">
            {[
              { title: "Business Entity Status", desc: "CV (Trading Business)" },
              { title: "SIUP", desc: "459 / 13-1 / PK / III / 1993" },
              { title: "Last Articles of Association", desc: "2001" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col text-center transition delay-50 duration-300 ease-in-out hover:-translate-y-10 hover:scale-110 hover:shadow-lg items-center w-[300px] h-full shadow-md rounded-lg bg-white-800 gap-3 py-10 px-8 flex-1"
              >
                <div className="space-y-4">
                  <h3 className="font-bold mb-2 text-orange-800 text-xl">{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-row items-center justify-center text-center'>
            <div className='w-1/2 h-full rouded-lg text-gray-600'>
            <p>
              CV. Cipta Karya Abadi operates in full compliance with Indonesian laws and regulations, ensuring ethical business practices in all our operations.
            </p>
            </div>
          </div>
        </div>
      </div>
</section>
<section className="px-12 py-12 bg-gray-50 text-center" id="areas">
  <h3 className="font-bold text-gray-600 text-2xl mb-5">Service Areas</h3>
  <div className="flex flex-wrap justify-center gap-4">
    {[
      "Surabaya (HQ)",
      "Cilacap",
      "Kebumen",
      "Pekalongan",
      "Solo"
    ].map((place, index) => (
      <div
        key={index}
        className="flex items-center justify-center rounded-[30px] min-w-[150px] px-5 py-2 shadow-lg gap-2 font-semibold text-md bg-white"
      >
        <i className="fas fa-map-marker-alt text-orange-800"></i>
        <span>{place}</span>
      </div>
    ))}
  </div>
</section>
<section className="py-12 bg-orange-100 text-center">
  <h2 className="text-3xl font-semibold text-orange-800 mb-4">Get in Touch</h2>
  <p className="text-gray-700 mb-6">
    Have questions or want to learn more about us?{' '}
    <Link to="/Contact" className="text-orange-600 underline hover:text-orange-800">
      Contact us
    </Link>{' '}
    and we’ll be happy to help.
  </p>
</section>
  </div>
</div>

  )
}

export default About;
