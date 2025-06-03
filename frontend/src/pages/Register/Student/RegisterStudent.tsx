import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";
import Button from "../../../components/common/Button/Button";
import studentImg from "../../../images/student.png";
import Input from "../../../components/common/Input/Input";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  address?: string;
};

function RegisterStudent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setEmailError('');

      const response = await axios.post("http://localhost:8000/students",
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          dateOfBirth: data.dateOfBirth,
          address: data.address
        },
        {
          withCredentials: true,
        }
      );

      const { username, password } = response.data.credentials;
      setCredentials({ username, password });
      setShowCredentials(true);
    } catch (error: any) {
      console.error("Error creating student:", error);
      if (error.response?.data?.message?.includes("email")) {
        setEmailError("A user with this email already exists.");
      } else {
        alert("Something went wrong while creating the student.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow px-4 py-12 font-montserrat">
        <div className="max-w-6xl mx-auto pl-8">
          <h1 className="text-3xl font-bold">Registration</h1>
          <p className="text-gray-500">Student</p>
        </div>

        <div className={`bg-white p-8 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start ${loading ? 'blur-sm pointer-events-none' : ''}`}>
          <div className="flex flex-col">
            <img src={studentImg} alt="Student" className="w-full rounded-lg object-cover h-full" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full flex flex-col">
            <div>
              <label className={`block text-sm font-bold mb-1 ${errors.firstName ? 'text-red-500' : 'text-gray-700'}`}>
                First name
              </label>
              <Input
                {...register("firstName", { required: true })}
                placeholder="First Name"
                hasError={!!errors.firstName}
                disabled={loading}
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-1 ${errors.lastName ? 'text-red-500' : 'text-gray-700'}`}>
                Last name
              </label>
              <Input
                {...register("lastName", { required: true })}
                placeholder="Last Name"
                hasError={!!errors.lastName}
                disabled={loading}
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-1 ${errors.email ? 'text-red-500' : 'text-gray-700'}`}>
                Email
              </label>
              <Input
                type="email"
                {...register("email", { required: true })}
                placeholder="Email"
                hasError={!!errors.email}
                disabled={loading}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div>
              <label className={`block text-sm font-bold mb-1 ${errors.dateOfBirth ? 'text-red-500' : 'text-gray-700'}`}>
                Date of birth (optional)
              </label>
              <Input
                {...register("dateOfBirth")}
                placeholder="Date of birth"
                hasError={!!errors.dateOfBirth}
                disabled={loading}
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-1 ${errors.address ? 'text-red-500' : 'text-gray-700'}`}>
                Address (optional)
              </label>
              <Input
                {...register("address")}
                placeholder="Address"
                hasError={!!errors.address}
                disabled={loading}
              />
            </div>

            <Button type="submit" disabled={loading} variant="primary">Submit</Button>
          </form>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm z-50">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-purple-700" />
          </div>
        )}
      </main>

      {showCredentials && credentials && (
        <div className="absolute inset-0 z-50 flex items-start justify-center bg-white bg-opacity-90 backdrop-blur-md font-montserrat mt-20">
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Registration</h2>

            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">
                  <FontAwesomeIcon icon={faCheck} size="1x" className="text-white-600" />
                </span>
              </div>
            </div>

            <p className="mb-4 text-gray-700">
              Congratulations, you have successfully registered with Learn Platform! Here are your credentials that you can change in your account
            </p>

            <div className="mb-4 text-center">
              <p><strong>User name</strong><br />{credentials.username}</p>
              <p className="mt-2"><strong>Password</strong><br />{credentials.password}</p>
            </div>

            <Button onClick={() => navigate("/login/student")}>My account</Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default RegisterStudent;
