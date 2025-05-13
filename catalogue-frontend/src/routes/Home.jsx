import logo from '../logo.svg';
import '../App.css';

function Home() {
  return (
      <div className="Home">
      <section class="bg-gray-100 py-16">
          <div class="max-w-6xl mx-auto px-4 text-center">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Discover Our Collection</h1>
            <p class="text-gray-600 mb-6">Explore our wide range of high-quality products carefully selected for you.</p>
            <a href="#categories" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">Shop Now</a>
          </div>
        </section>
        <section class="py-16 bg-white" id="categories">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-semibold text-gray-800 mb-2">Our Categories</h2>
              <p class="text-gray-600">Browse through our diverse categories and find exactly what you need.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              

              <div class="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img src="https://cdn.pixabay.com/photo/2016/11/19/15/32/laptop-1839876_1280.jpg" alt="Electronics" class="w-full h-48 object-cover"></img>
                <div class="p-4 text-center">
                  <h3 class="text-xl font-semibold text-gray-800">Electronics</h3>
                  <p class="text-gray-600 text-sm mb-4">Latest gadgets and tech accessories</p>
                  <a href="#" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">View All</a>
                </div>
              </div>

            
              <div class="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img src="https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg" alt="Fashion" class="w-full h-48 object-cover"></img>
                <div class="p-4 text-center">
                  <h3 class="text-xl font-semibold text-gray-800">Fashion</h3>
                  <p class="text-gray-600 text-sm mb-4">Trending clothes and accessories</p>
                  <a href="#" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">View All</a>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img src="https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg" alt="Home Decor" class="w-full h-48 object-cover"></img>
                <div class="p-4 text-center">
                  <h3 class="text-xl font-semibold text-gray-800">Home Decor</h3>
                  <p class="text-gray-600 text-sm mb-4">Stylish items for your home</p>
                  <a href="#" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">View All</a>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img src="https://cdn.pixabay.com/photo/2016/11/22/19/25/adult-1850181_1280.jpg" alt="Sports" class="w-full h-48 object-cover"></img>
                <div class="p-4 text-center">
                  <h3 class="text-xl font-semibold text-gray-800">Sports</h3>
                  <p class="text-gray-600 text-sm mb-4">Equipment for all kinds of sports</p>
                  <a href="#" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">View All</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}

export default Home;
