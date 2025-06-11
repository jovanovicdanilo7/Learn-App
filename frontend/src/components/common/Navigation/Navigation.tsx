import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  currentPath: string;
  mobile?: boolean;
}

function Navigation({ currentPath, mobile = false }: NavigationProps) {
  const [currentUser, setCurrentUser] = useState<null | {
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    role?: 'student' | 'trainer';
  }>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/user/me",
          {
            withCredentials: true,
          }
        );

        try {
          await axios.get(`https://v1yymau18l.execute-api.eu-north-1.amazonaws.com/students/${data.id}`,
            {
              withCredentials: true,
            }
          );
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

  const linkClass = (path: string) =>
    `${mobile ? 'block mb-3 text-lg' : 'inline-block mr-6'} font-medium
     ${currentPath === path ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'}`;

  return (
    <nav className={mobile ? "mt-4" : "flex"}>
      <Link to="/blog" className={linkClass("/blog")}>Blog</Link>
      <Link to="/pricing" className={linkClass("/pricing")}>Pricing</Link>
      <Link to="/about" className={linkClass("/about")}>About Us</Link>
      {mobile && (
        <Link
          to={currentUser?.role === 'trainer' ? "/my-account-trainer" : "/my-account-student"}
          className={`${linkClass(
            currentUser?.role === 'trainer' ? "/my-account-trainer" : "/my-account-student"
          )} ${currentUser ? '' : 'pointer-events-none opacity-50'}`}
        >
          My Account
        </Link>
      )}
    </nav>
  );
}

export default Navigation;
