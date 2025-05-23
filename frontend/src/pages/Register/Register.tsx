import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import Button from "../../components/common/Button/Button";
import trainerImage from "../../images/trainers.png";
import studentImage from "../../images/students.png";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header />

      <main className="flex-grow px-4 py-12 bg-white mt-1">
        <h1 className="text-4xl font-bold text-center mb-12">Join Us</h1>

        <div className="space-y-10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center bg-gray-50 rounded-lg p-6 shadow-md">
            <div className="md:w-1/2 mb-4 md:mb-0 px-12 py-12">
              <h2 className="text-3xl font-bold mb-2">Register as Trainer</h2>
              <p className="text-gray-600 mb-4">
                Do consectetur proident proident id eiusmod deserunt consequat pariatur ad ex velit do Lorem reprehenderit.
              </p>
              <Button onClick={() => navigate('/register-trainer')}>Join us</Button>
            </div>
            <div className="md:w-1/2">
              <img src={trainerImage} alt="Trainers" className="rounded-lg w-full h-auto object-cover" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center bg-gray-50 rounded-lg p-6 shadow-md">
            <div className="md:w-1/2 mb-4 md:mb-0 px-12 py-12">
              <h2 className="text-3xl font-bold mb-2">Register as Student</h2>
              <p className="text-gray-600 mb-4">
                Do consectetur proident proident id eiusmod deserunt consequat pariatur ad ex velit do Lorem reprehenderit.
              </p>
              <Button onClick={() => navigate('/register-student')}>Join us</Button>
            </div>
            <div className="md:w-1/2">
              <img src={studentImage} alt="Students" className="rounded-lg w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Register;
