import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="flex space-x-6">
      <Link to="/blog" className="text-gray-500 font-bold">Blog</Link>
      <Link to="/pricing" className="text-gray-500 font-bold">Pricing</Link>
      <Link to="/about" className="text-gray-500 font-bold">About Us</Link>
    </nav>
  );
}

export default Navigation;
