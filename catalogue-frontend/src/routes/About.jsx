import logo from '../logo.svg';
import '../App.css';
import React, { useEffect, useState } from 'react';

function About() {
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_PUBLIC_API_URL}/api/profile/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);
  return(
    <div className='About'>
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="page-container">
          <div className="relative pt-10 pb-6 lt:-mt-5 lt:pb-0 lt:pt-[110px] lt:h-[514px] lz:h-[544px] xl:h-[564px] xxl:h-[724px] bg-white">
            <div className="text-center px-6 xs:px-12 md:px-20 lt:relative lt:z-[1] lt:px-32 xl:px-0 lt:max-w-lg lt:mx-auto">
              <h1 className="text-3xl font-bold text-orange-700 mb-0">About Us</h1>
              <h2 className="text-4xl font-bold mb-0 pt-2 xxs:text-5xl">Our Beginnings</h2>
            </div>
            <div className="pt-10 flex items-center justify-center lt:w-full md:px-4 lt:px-0 lt:absolute lt:items-end lt:top-[110px]">
              <div className="hidden lt:block lt:h-[450px] lz:h-[480px] xl:h-[500px] xxl:h-[660px]">
                <img
                  className="lt:h-full"
                  src="//cdnimg.webstaurantstore.com/uploads/design/2023/5/collage-img1.png"
                  alt="First image is a person seasoning tomatoes. Second image is workers planning out a new warehouse plan."
                />
              </div>
              <div className="lt:px-6 lt:h-[220px] lz:h-[260px] xl:h-[300px] xxl:h-[360px] xxl:pb-[70px]">
                <img
                  className="lt:h-full"
                  src="//cdnimg.webstaurantstore.com/uploads/design/2023/5/collage-img2.png"
                  alt="First image is a box of salad. Second image is a person wearing an apron in a bakery. Third image is a worker carrying boxes in a warehouse facility."
                />
              </div>
              <div className="hidden lt:block lt:h-[450px] lz:h-[480px] xl:h-[500px] xxl:h-[660px]">
                <img
                  className="lt:h-full"
                  src="cdnimg.webstaurantstore.com/uploads/design/2023/5/collage-img3-new.png"
                  alt="First image is a person making homemade pasta. Second image is a person cooking a vegetable stir fry."
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-md m-4">
                <h3 className="text-xl font-semibold mb-2">Innovative Solutions</h3>
                <p className="text-center">
                  We provide cutting-edge technology to help businesses grow and succeed in the digital age.
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-md m-4">
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-center">
                  Our products are handpicked to ensure the highest quality for our customers.
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-md m-4">
                <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
                <p className="text-center">
                  We are committed to providing excellent customer service and support, every step of the way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default About;
