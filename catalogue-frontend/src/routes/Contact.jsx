import React, { useState } from 'react';
import axios from 'axios';
function Contact(){
    const [formData, setFormData] = useState({
    isi_pesan: '',
    waktu: '',
    });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token from localStorage or your auth state management
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to send a message.');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/Catalogue_api/pesan/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`, // or 'Bearer <jwt-token>'
          },
        }
      );
      console.log('Success:', response.data);
      alert('Message submitted successfully!');
      setFormData({ isi_pesan: '', waktu: '' });  // reset form after success
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit message.');
    }
  };
    return(
        <div id="Contact" className="Contact"> 
            <div className="min-h-screen flex flex-col gap-8">
            <section
                className="bg-cover bg-center bg-gray-700 py-16 font-sans mt-[2%]"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),url('https://cdn.pixabay.com/photo/2017/10/27/10/27/architecture-2893844_1280.jpg'`,
                }}
                >
                <div className="w-full max-w-6xl mx-auto text-white text-center">
                    <h1 className="font-bold text-4xl">Contact Us</h1>
                    <p>We'd love to hear from you. Reach out to us with any questions or inquiries.</p>
                </div>
            </section>
            <section className="py-16 px-16">
                <div className="flex flex-col lg:flex-row gap-10 justify-center items-center">
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex flex-col items-center text-center rounded-lg shadow-lg w-[30vh] h-[35vh] bg-white gap-3 py-10 px-8">
                            <div className="flex items-center justify-center rounded-[50%] w-[2em] h-[2em] bg-gray-200 text-2xl text-orange-800"><i class="fas fa-map-marker-alt"></i></div>
                            <div>
                                <h3 className="font-bold mb-2">Visit Us</h3>
                                <p>We are committed to ensuring the welfare and prosperity of all employees and their families.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex flex-col items-center text-center rounded-lg shadow-lg w-[30vh] h-[35vh] bg-white gap-3 py-10 px-8">
                            <div className="flex items-center justify-center rounded-[50%] w-[2em] h-[2em] bg-gray-200 text-2xl text-orange-800"><i class="fas fa-phone-alt"></i></div>
                            <div>
                                <h3 className="font-bold mb-2">Visit Us</h3>
                                <p>We are committed to ensuring the welfare and prosperity of all employees and their families.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex flex-col items-center text-center rounded-lg shadow-lg w-[30vh] h-[35vh] bg-white gap-3 py-10 px-8">
                            <div className="flex items-center justify-center rounded-[50%] w-[2em] h-[2em] bg-gray-200 text-2xl text-orange-800"><i class="fas fa-envelope"></i></div>
                            <div>
                                <h3 className="font-bold mb-2">Visit Us</h3>
                                <p>We are committed to ensuring the welfare and prosperity of all employees and their families.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex flex-col items-center text-center rounded-lg shadow-lg w-[30vh] h-[35vh] bg-white gap-3 py-10 px-8">
                            <div className="flex items-center justify-center rounded-[50%] w-[2em] h-[2em] bg-gray-200 text-2xl text-orange-800"><i class="fas fa-clock"></i></div>
                            <div>
                                <h3 className="font-bold mb-2">Visit Us</h3>
                                <p>We are committed to ensuring the welfare and prosperity of all employees and their families.</p>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </div>
        </div>
       
    )
};
export default Contact;