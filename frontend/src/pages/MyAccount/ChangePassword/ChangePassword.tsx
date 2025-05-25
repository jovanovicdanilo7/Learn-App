import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Footer from "../../../components/common/Footer/Footer";
import Header from "../../../components/common/Header/Header";
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isActive: boolean;
  photo?: string;
}

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function ChangePassword() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const newPassword = watch("newPassword");

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await axios.get("http://localhost:8000/user/me", {
        withCredentials: true,
      });
      setUser(userData);
    };

    fetchData();
  }, []);

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await axios.put(
        "http://localhost:8000/user/update-password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        },
        { withCredentials: true }
      );
      navigate("/my-account");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header user={user ?? undefined} />

      <main className="flex-grow px-4 pt-8 pb-10 md:px-20 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-10">Security</h1>

        <div className="grid md:grid-cols-[250px_1fr] gap-10">
          <div className="flex items-start gap-2 text-lg font-bold text-gray-700">
            <FontAwesomeIcon icon={faLock} className="text-xl" />
            Change Password
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white border rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <label className="block font-bold text-gray-700 text-sm mb-1">
                Current password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter current password"
                  {...register("currentPassword", { required: "Current password is required" })}
                  hasError={!!errors.currentPassword}
                  showToggle
                />
              </div>
              {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block font-bold text-gray-700 text-sm mb-1">
                New password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword", { required: "New password is required" })}
                  hasError={!!errors.newPassword}
                  showToggle
                />
              </div>
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
            </div>

            <div className="mb-6">
              <label className="block font-bold text-gray-700 text-sm mb-1">
                Confirm new password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value =>
                      value === newPassword || "Passwords do not match"
                  })}
                  hasError={!!errors.confirmPassword}
                  showToggle
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

            <div className="flex justify-end gap-4">
              <Button
                variant="text"
                className="text-gray-500 text-sm hover:text-gray-600"
                onClick={() => navigate("/my-account")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">Change password</Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ChangePassword;
