import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/common/Header/Header";
import Footer from "../../../components/common/Footer/Footer";
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";
import trainerImg from "../../../images/trainer.png";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
};

type Specialization = {
  id: string;
  specialization: string;
};

function RegisterTrainer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get("https://91zmzn87cd.execute-api.eu-north-1.amazonaws.com/specializations");
        setSpecializations(response.data);
      } catch (err) {
        console.error("Failed to load specializations:", err);
      }
    };

    fetchSpecializations();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setEmailError('');

      const response = await axios.post("https://91zmzn87cd.execute-api.eu-north-1.amazonaws.com/trainers",
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          specialization: data.specialization,
        },
        {
          withCredentials: true,
        }
      );

      const { username, password } = response.data.credentials;
      setCredentials({ username, password });
      setShowCredentials(true);
    } catch (error: any) {
      console.error("Error creating trainer:", error);
      if (error.response?.data?.message?.includes("email")) {
        setEmailError("A user with this email already exists.");
      } else {
        alert("Something went wrong while creating the trainer.");
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
          <p className="text-gray-500">Trainer</p>
        </div>

        <div className={`bg-white p-8 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start ${loading ? 'blur-sm pointer-events-none' : ''}`}>

          <div className="flex flex-col">
            <img src={trainerImg} alt="Trainer" className="w-full rounded-lg object-cover h-full" />
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
              <label className={`block text-sm font-bold mb-1 ${errors.specialization ? 'text-red-500' : 'text-gray-700'}`}>
                Specialization
              </label>
              <select
                {...register("specialization", { required: true })}
                className={`bg-white mt-1 block w-full border rounded-md p-2 ${errors.specialization ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              >
                <option value="">Please select</option>

                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.specialization}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" variant="primary" disabled={loading}>Submit</Button>
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
                  <FontAwesomeIcon icon={faCheck} size="1x" className="text-white-600"/>
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

            <Button onClick={() => navigate("/login/trainer")}>My account</Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default RegisterTrainer;