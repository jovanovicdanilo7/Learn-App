import { Link } from 'react-router-dom';

interface NavigationProps {
  currentPath: string;
  mobile?: boolean;
}

function Navigation({ currentPath, mobile = false }: NavigationProps) {
  const linkClass = (path: string) =>
    `${mobile ? 'block mb-3 text-lg' : 'inline-block mr-6'} font-medium ${
      currentPath === path ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'
    }`;

  return (
    <nav className={mobile ? "mt-4" : "flex"}>
      <Link to="/blog" className={linkClass("/blog")}>Blog</Link>
      <Link to="/pricing" className={linkClass("/pricing")}>Pricing</Link>
      <Link to="/about" className={linkClass("/about")}>About Us</Link>
      {mobile && (
        <Link to="/my-account" className={linkClass("/my-account")}>My Account</Link>
      )}
    </nav>
  );
}

export default Navigation;
