import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import Footer from "../../../components/common/Footer/Footer";
import Header from "../../../components/common/Header/Header";
import Button from "../../../components/common/Button/Button";
import avatar from "../../../images/avatar.png";
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

interface Student {
  id: string;
  userId: string;
  address?: string;
  dateOfBirth?: string;
}

function EditProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [specializations, setSpecializations] = useState<{ id: string; specialization: string }[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [photoData, setPhotoData] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  const isStudentAccount = location.pathname.includes("/my-account-student/edit");

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await axios.get("http://localhost:8000/user/me",
        {
          withCredentials: true,
        }
      );
      setUser(userData);

      if (isStudentAccount) {
        const studentRes = await axios.get(`http://localhost:8000/students/${userData.id}`,
          {
            withCredentials: true
          }
        );
        setStudent(studentRes.data);
      } else {
        const specsRes = await axios.get("http://localhost:8000/specializations");
        setSpecializations(specsRes.data);

        const trainerRes = await axios.get(`http://localhost:8000/trainers/${userData.id}`,
          {
            withCredentials: true
          }
        );
        setSelectedSpecialization(trainerRes.data.specializationId);
      }
    };

    fetchData();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoData(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    const userUpdate = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    };

    await axios.put(`http://localhost:8000/user/${user.id}`, userUpdate,
      {
        withCredentials: true
      }
    );

    if (isStudentAccount && student) {
      await axios.put(`http://localhost:8000/students/${student.id}`,
        {
          address: student.address,
          dateOfBirth: student.dateOfBirth,
        },
        {
          withCredentials: true
        }
      );
    } else {
      await axios.put(`http://localhost:8000/trainers/${user.id}`,
        {
          specializationId: selectedSpecialization,
        },
        {
          withCredentials: true
        }
      );
    }

    if (photoData) {
      await axios.post( "http://localhost:8000/user/upload-photo",
        {
          data: photoData
        },
        {
          withCredentials: true
        }
      );
    }

    navigate(isStudentAccount ? "/my-account-student" : "/my-account-trainer");
  };

  const handleInputChange = (field: keyof User, value: string | boolean) => {
    if (user) setUser({ ...user, [field]: value });
  };

  const handleStudentChange = (field: keyof Student, value: string) => {
    if (!student) return;

    const newValue =
      field === 'dateOfBirth'
        ? value.split('-').reverse().join('.')
        : value;

    setStudent({ ...student, [field]: newValue });
  };

  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';

    const [day, month, year] = dateString.split('.');

    if (!day || !month || !year) return '';
      return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Header/>

      <main className="flex-grow px-4 pt-4 pb-10 md:px-20 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center my-12">My Account</h1>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Edit profile</h2>

            <div className="flex items-start gap-10 mb-6">
              <div className="flex-col">
                <h4 className="font-semibold text-gray-700">Profile photo</h4>
                <img
                  src={photoData || user?.photo || avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>

              <div>
                <div className="text-sm font-medium mb-1 text-gray-700">Upload your photo</div>
                <div className="text-xs text-gray-500 mb-2">
                  Your photo should be in PNG or JPG format
                </div>

                <div className="flex gap-4">
                  <label className="mt-1" htmlFor="imageUpload">
                    <span className="px-4 py-2 rounded-md text-sm font-medium transition border border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer">
                      Choose image
                    </span>
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />

                  <Button
                    variant="text"
                    className="text-gray-400"
                    onClick={() => setPhotoData('')}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">First Name</label>
              <Input
                value={user?.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />

              <label className="block text-sm font-bold text-gray-700">Last Name</label>
              <Input
                value={user?.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />

              <label className="block text-sm font-bold text-gray-700">Username</label>
              <Input
                value={user?.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />

              <label className="block text-sm font-bold text-gray-700">Email</label>
              <Input
                type="email"
                value={user?.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />

              {isStudentAccount && (
                <>
                  <label className="block text-sm font-bold text-gray-700">Date of Birth</label>
                  <Input
                    type="date"
                    value={formatDateForInput(student?.dateOfBirth)}
                    onChange={(e) => handleStudentChange('dateOfBirth', e.target.value)}
                  />

                  <label className="block text-sm font-bold text-gray-700">Address</label>
                  <Input
                    value={student?.address || ''}
                    onChange={(e) => handleStudentChange('address', e.target.value)}
                  />
                </>
              )}
            </div>
          </div>

          {!isStudentAccount && (
            <div className="p-6">
              <h3 className="font-semibold mb-2">My specialization</h3>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="border px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Dropdown</option>
                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center gap-6">
          <Button
            variant="text"
            className="text-gray-400 text-sm hover:text-gray-600"
            onClick={() =>
              navigate(isStudentAccount ? "/my-account-student" : "/my-account-trainer")
            }
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default EditProfile;
