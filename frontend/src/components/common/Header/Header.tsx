import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import {
  faUser,
  faMoon,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';

import logo from '../../../images/logo.png';
import avatar from '../../../images/avatar.png';
import Button from '../Button/Button';
import Navigation from '../Navigation/Navigation';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<null | {
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    role?: 'student' | 'trainer';
  }>(null);

  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/user/me", {
          withCredentials: true,
        });

        try {
          await axios.get(`http://localhost:8000/students/${data.id}`, {
            withCredentials: true,
          });
          data.role = "student";
        } catch {
          data.role = "trainer";
        }

        setCurrentUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/auth/logout', {},
        {
          withCredentials: true
        }
      );

      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="flex items-center justify-between py-2 bg-white shadow-md rounded-md font-montserrat relative">
      {!isLoginPage && (
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="text-purple-600" />
          </button>
        </div>
      )}

      <div className="flex items-center">
        <div className="flex-1 flex justify-center md:justify-start">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        {!isLoginPage && (
          <div className="hidden md:flex ml-5">
            <Navigation currentPath={location.pathname} />
          </div>
        )}
      </div>

      {!isLoginPage && currentUser ? (
        <div className="relative">
          <img
            src={currentUser.photo || avatar}
            alt="avatar"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="h-10 w-10 rounded-full cursor-pointer border-2 border-purple-500"
          />
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <div className="flex items-center mb-4">
                <img
                  src={currentUser.photo || avatar}
                  className="w-10 h-10 rounded-full mr-3"
                  alt="avatar"
                />
                <div>
                  <div className="font-semibold">
                    {currentUser.firstName}_{currentUser.lastName}
                  </div>
                  <div className="text-sm text-gray-500 truncate overflow-hidden whitespace-nowrap max-w-[160px]">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200 w-full mb-10" />

              <div className="flex items-center mb-4 space-x-2 text-gray-700">
                <FontAwesomeIcon icon={faUser} />
                <Link
                  to={currentUser?.role === 'student' ? "/my-account-student" : "/my-account-trainer"}
                  className="text-sm font-medium text-gray-500 hover:text-purple-600"
                >
                  My Account
                </Link>
              </div>

              <div className="flex items-center justify-between mb-4 text-gray-700">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faMoon} />
                  <span className="text-sm font-medium">Night mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={false} readOnly className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-checked:bg-purple-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 transition-all"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-5"></div>
                </label>
              </div>

              <div className="h-px bg-gray-200 w-full mt-10 mb-2" />

              <Button
                onClick={handleLogout}
                variant="text"
                className="flex items-center text-sm font-semibold text-gray-500 hover:underline"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                Sign out
              </Button>
            </div>
          )}
        </div>
      ) : (
        !isLoginPage && (
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="text" onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <Button variant="primary" onClick={() => navigate('/register')}>
              Join us
            </Button>
          </div>
        )
      )}

      {!isLoginPage && isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg p-4 transition-transform">
          <div className="flex justify-between items-center mb-6">
            <div>
              <img
                src={currentUser?.photo || avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full mb-1"
              />
              <div className="font-semibold">
                {currentUser?.firstName}_{currentUser?.lastName}
              </div>
              <div className="text-sm text-gray-500">{currentUser?.email}</div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)}>
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
