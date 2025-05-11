import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-white py-12" id="contact">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>support@uniclear.edu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>davehaile44@gmail</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>+251 94 42 89 667</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/loginExample" className="hover:text-blue-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to={'/admin/Dashbord'} className="hover:text-blue-400">
                  Profile
                  </Link>
                </li>
                <li>
                  <Link to="/approve" className="hover:text-blue-400">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <Link to="/loginOrignal" className="hover:text-blue-400">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link to="/forget-password" className="hover:text-blue-400">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link to="/loginMoke" className="hover:text-blue-400">
                  <Instagram className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>© {new Date().getFullYear()} UniClear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
