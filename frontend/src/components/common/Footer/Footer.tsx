import { Link } from 'react-router-dom';
import { faFacebook, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import logo from '../../../images/logo.png'
import axios from 'axios';
import Button from '../Button/Button';
import Input from '../Input/Input';

function Footer() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setFeedback("Email is required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/subscriptions", { email });
      setFeedback("Thank you for subscribing!");
      setEmail("");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setFeedback(error.response.data.message);
      } else {
        setFeedback("Subscription failed. Please try again later.");
      }
    }
  };

  return (
    <footer className="bg-[#F9F9FB] text-[#1A1A1A] px-6 py-10 font-montserrat">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-8">

        <div className="col-span-1">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo"/>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-left text-2xl">Product</h4>
          <ul className="space-y-2 text-sm text-left text-base">
            <li>
              <Link to="/features" className="text-gray-500 font-medium">Features</Link>
            </li>
            <li>
              <Link to="/pricing" className="text-gray-500 font-medium">Pricing</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-left text-2xl">Resources</h4>
          <ul className="space-y-2 text-sm text-left text-base">
            <li>
              <Link to="/blog" className="text-gray-500 font-medium">Blog</Link>
            </li>
            <li>
              <Link to="/user-guides" className="text-gray-500 font-medium">User guides</Link>
            </li>
            <li>
              <Link to="/webinars" className="text-gray-500 font-medium">Webinars</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-left text-2xl">Company</h4>
          <ul className="space-y-2 text-sm text-left text-base">
            <li>
              <Link to="/about" className="text-gray-500 font-medium">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-500 font-medium">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2 text-left">
          <h4 className="font-semibold text-[#6D5BD0] mb-2">Subscribe to our newsletter</h4>
          <p className="text-sm mb-3">For product announcements and exclusive insights</p>
          <div className="flex border rounded overflow-hidden">
            <Input
              type="email"
              placeholder="Input your email"
              className="px-3 py-2 text-sm w-full focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleSubscribe} className="bg-purple-600 text-white px-4 py-2">
              Subscribe
            </Button>
          </div>
          {feedback && <p className="text-sm mt-2 text-red-600">{feedback}</p>}
        </div>
      </div>

      <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-[#7D899C]">
        <div className="flex items-center gap-4">
          <select className="border rounded px-3 py-1">
            <option>English</option>
          </select>
        </div>
        <p className="mt-4 md:mt-0">© 2023 Learn, Inc. · Privacy · Terms</p>
        <div className="flex space-x-4 mt-4 md:mt-0 text-[#6D5BD0] text-xl">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
