import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-orange-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Shop */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-orange-200">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/Katalog" className="hover:text-orange-300 transition">All Products</Link></li>
              <li><Link to="/" className="hover:text-orange-300 transition">Featured</Link></li>
              <li><a href="#" className="hover:text-orange-300 transition">New Arrivals</a></li>
              <li><a href="#" className="hover:text-orange-300 transition">Discounted</a></li>
            </ul>
          </div>

          {/* Column 2: Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-orange-200">Information</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/About" className="hover:text-orange-300 transition">About Us</Link></li>
              <li><Link to="/Contact" className="hover:text-orange-300 transition">Contact Us</Link></li>
              <li><Link to="/Contact" className="hover:text-orange-300 transition">Terms & Conditions</Link></li>
              <li><Link to="/Contact" className="hover:text-orange-300 transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-orange-200">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/About" className="hover:text-orange-300 transition">FAQ</Link></li>
              <li><a href="#" className="hover:text-orange-300 transition">Shipping</a></li>
              <li><a href="#" className="hover:text-orange-300 transition">Returns</a></li>
              <li><a href="#" className="hover:text-orange-300 transition">Order Status</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-orange-200">Contact Us</h3>
            <div className="text-sm leading-relaxed text-orange-100">
              <p>123 Main Street</p>
              <p>City, State 12345</p>
              <p className="mt-2">Phone: (123) 456-7890</p>
              <p>Email: info@catalogue.com</p>
            </div>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-xl hover:text-orange-300 transition"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-xl hover:text-orange-300 transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-xl hover:text-orange-300 transition"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-800 mt-12 pt-8 text-center text-sm text-orange-200">
          <p>© 2026 Catalogue. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;