import { Link } from 'react-router-dom';

interface NavigationProps {
  currentPath: string;
}

function Navigation({ currentPath }: NavigationProps) {
  return (
    <nav className="flex space-x-6">
      <Link
        to="/blog"
        className={`font-bold ${currentPath === "/blog" ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}`}
      >
        Blog
      </Link>
      <Link
        to="/pricing"
        className={`font-bold ${currentPath === "/pricing" ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}`}
      >
        Pricing
      </Link>
      <Link
        to="/about"
        className={`font-bold ${currentPath === "/about" ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}`}
      >
        About Us
      </Link>
    </nav>
  );
}

export default Navigation;
