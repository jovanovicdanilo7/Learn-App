import { useNavigate } from 'react-router-dom';

import Button from '../../components/common/Button/Button';
import Footer from '../../components/common/Footer/Footer';
import Header from '../../components/common/Header/Header';
import background from "../../images/joinusbackground.jpg";
import thumbnail from "../../images/thumbnail.jpg";
import WelcomeMessage from '../../components/common/WelcomeMessage/WelcomeMessage';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-center">
      <Header/>

      <div className="max-w-4xl mx-auto py-14">
        <WelcomeMessage
          title="Let's start learning"
          description="Welcome to Learn Platform - where every day is a day to learn.
          Dive into the vast ocean of knowledge and empower yourself with
          the tools for a successful tomorrow. Happy learning!"
        />

        <div className="relative w-full max-w-4xl mx-auto aspect-video shadow-lg">
          <video
            controls
            className="w-full h-full object-cover"
            poster={thumbnail}
          >
            <source src="/videos/intro.mp4" type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="my-10 mx-20">
        <div
          className="relative w-full bg-no-repeat bg-cover bg-center py-20 min-h-[300px]"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#6D5BD0] mb-6 font-montserrat">
              Join us
            </h2>

            <p className="text-base sm:text-lg text-[#1A1A1A] mb-10 font-montserrat">
              Qui ut exercitation officia proident enim non tempor<br />
              tempor ipsum ex nulla ea adipisicing sit consequat enim<br />
              elit cupidatat o
            </p>

            <Button variant="primary" onClick={() => navigate('/register')}>Join us</Button>
            <Button className="md:hidden" variant='text' onClick={() => navigate('/login')}>Sign in</Button>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default Home;
