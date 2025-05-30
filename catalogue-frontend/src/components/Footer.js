import { Link } from "react-router-dom";
function Footer(){
    return(
        <footer className="bg-white rounded-xl shadow-sm m-2 dark:bg-gray-800">
        <div className="p-4 bg-orange-800 text-white">
           <div className="flex flex-wrap lg:flex-row items-center lg:justify-center space-y-2 lg:space-y-0 lg:space-x-2 gap-2">
                <div className="footer-column">
                    <h3>Shop</h3>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li><Link to="/Katalog" className="hover:underline me-4 md:me-6">All Products</Link></li>
                        <li><Link to="/"className="hover:underline me-4 md:me-6">Featured</Link></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">New Arrivals</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Discounted</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Information</h3>
                    <ul className="flex md:flex-row sm:flex-col items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li><Link to="/About" className="hover:underline me-4 md:me-6">About Us</Link></li>
                        <li><Link to="/Contact" className="hover:underline me-4 md:me-6">Contact Us</Link></li>
                        <li><Link to="/Contact" className="hover:underline me-4 md:me-6">Terms &amp; Conditions</Link></li>
                        <li><Link to="/Contact" className="hover:underline me-4 md:me-6">Privacy Policy</Link></li>
                    </ul>
                    </div>
                <div className="footer-column mr-[100%]">
                    <h3>Customer Service</h3>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li><Link to="/About" className="hover:underline me-4 md:me-6">FAQ</Link></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Shipping</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Returns</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Order Status</a></li>
                    </ul>
                </div>
                <div className="footer-column flex flex-col self-end lg:text-right text-left">
                    <h3>Contact Us</h3>
                    <div><p>123 Main Street<br/>City, State 12345<br/>Phone: (123) 456-7890<br/>Email: info@catalogue.com</p></div>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-pinterest"></i></a>
                    </div>
                </div>
            </div>
            <div className="copyright lg:text-center">
                <p>© 2023 Catalogue. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
    )
}
export default Footer;