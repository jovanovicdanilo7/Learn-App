import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import logo from "../../../images/logo.png"
import Button from "../Button/Button";
import Navigation from "../Navigation/Navigation";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoginPage = location.pathname === '/login';

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md rounded-md font-montserrat relative">
      {!isLoginPage && (
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="text-purple-600" />
          </button>
        </div>
      )}

      <div className='flex items-center'>
        <div className="flex-1 flex justify-center md:justify-start">
          <img src={logo} alt="Logo" className="h-8" />
        </div>
  
        {!isLoginPage && (
          <div className="hidden md:flex ml-5">
            <Navigation currentPath={location.pathname} />
          </div>
        )}
      </div>
      

      {!isLoginPage && (
        <div className="hidden md:flex items-center space-x-2">
          <Button variant="text" onClick={() => navigate('/login')}>Sign in</Button>
          <Button variant="primary" onClick={() => navigate('/register')}>Join us</Button>
        </div>
      )}

      {!isLoginPage && isMenuOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg p-4 transition-transform">
          <div className="flex justify-between items-center mb-6">
            <div>
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="avatar"
                className="w-10 h-10 rounded-full mb-1"
              />
              <div className="font-semibold">John_12</div>
              <div className="text-sm text-gray-500">John_12@gmail.com</div>
            </div>
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="text-purple-600" />
            </button>
          </div>
          <Navigation currentPath={location.pathname} mobile />
        </div>
      )}
    </header>
  );
}

export default Header;
