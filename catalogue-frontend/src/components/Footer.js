function Footer(){
    return(
        <footer className="bg-white rounded-xl shadow-sm m-2 dark:bg-gray-800">
        <div className="p-4 bg-orange-800 text-white">
            <div className="flex flex-wrap items-center space-y-2">
                <div className="footer-column">
                    <h3>Shop</h3>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li><a href="#" className="hover:underline me-4 md:me-6">All Products</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Featured</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">New Arrivals</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Discounted</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Information</h3>
                    <ul className="flex md:flex-row sm:flex-col items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li><a href="#" className="hover:underline me-4 md:me-6">About Us</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Contact Us</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Terms &amp; Conditions</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a></li>
                    </ul>
                    </div>
                <div className="footer-column mr-96">
                    <h3>Customer Service</h3>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li><a href="#" className="hover:underline me-4 md:me-6">FAQ</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Shipping</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Returns</a></li>
                        <li><a href="#" className="hover:underline me-4 md:me-6">Order Status</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Contact Us</h3>
                    <p>123 Main Street<br/>City, State 12345<br/>Phone: (123) 456-7890<br/>Email: info@catalogue.com</p>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-pinterest"></i></a>
                    </div>
                </div>
            </div>
            <div className="copyright">
                <p>© 2023 Catalogue. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
    )
}
export default Footer;