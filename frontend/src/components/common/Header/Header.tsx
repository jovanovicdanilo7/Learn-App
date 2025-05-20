import { useNavigate } from 'react-router-dom';

import logo from "../../../images/logo.png"
import Button from "../Button/Button";
import Navigation from "../Navigation/Navigation";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md rounded-md">
      <div className="flex items-center">
        <div className="mr-5">
          <img src={logo} alt="Logo" />
        </div>
        <div>
          <Navigation />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="text" onClick={() => navigate('/login')}>Sign in</Button>
        <Button variant="primary" onClick={() => navigate('/register')}>Join us</Button>
      </div>
    </header>
  );
}

export default Header;
